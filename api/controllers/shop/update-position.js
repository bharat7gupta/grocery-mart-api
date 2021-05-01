const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
  invalidPosition: 'Invalid position',
  invalidLocationId: 'Invalid Location Id'
};

module.exports = {

  friendlyName: 'Update position of shop within location',

  description: 'Update position of shop within location',

  inputs: {
    shopId: {
      type: 'string'
    },
    position: {
      type: 'number'
    }
  },

  exits: {
    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },

    invalidRequest: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidPosition: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidLocationId: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { shopId, position } = inputs;

    if (typeof position !== 'number' && position < 0) {
      exits.invalidPosition(errorMessages.invalidPosition);
    }

    try {
      const shop = await Shop.findOne({ id: shopId });
      // check for confirmed shops only
      const prevPosition = shop.position;
      const isMovingUp = prevPosition > position;

      if (!shop) {
        exits.invalidRequest(errorMessages.invalidRequest);
      }

      const locationId = shop.locationId;
      const shops = await Shop.find({ locationId });

      for(let i=0; i<shops.length; i++) {
        const shop = shops[i];

        if (isMovingUp && shop.position >= position && shop.position < prevPosition) {
          await Shop.update({ id: shop.id }, { position: shop.position + 1 });
        } else if (!isMovingUp && shop.position <= position && shop.position > prevPosition) {
          await Shop.update({ id: shop.id }, { position: shop.position - 1 });
        }
      }

      const updatedShop = await Shop.update({ id: shopId }, { position }).fetch();

      this.res.json({
        code: 'success',
        data: updatedShop && updatedShop[0]
      });
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
