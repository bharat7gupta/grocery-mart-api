const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
  invalidLocationId: 'Invalid Location Id'
};

module.exports = {

  friendlyName: 'Update status',

  description: '',

  inputs: {
    shopId: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
    locationId: {
      type: 'string'
    },
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

    invalidLocationId: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { shopId, status, locationId } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!locationId || !status || decodedData.type !== 'admin') {
      exits.invalidRequest(errorMessages.invalidRequest);
      return;
    }

    let updatedData = { status };

    try {
      if (status === constants.SHOP_STATUS.CONFIRMED) {
        if (!locationId) {
          exits.invalidLocationId(errorMessages.invalidLocationId);
          return;
        }

        const location = await Location.findOne({ id: locationId });

        if (!location) {
          exits.invalidLocationId(errorMessages.invalidLocationId);
          return;
        } else {
          updatedData.locationId = location.id;
        }
      }

      const updatedShopDetails = await Shop.updateOne({ id: shopId })
        .set(updatedData);

      if (updatedShopDetails) {
        this.res.json({
          code: 'success',
          data: updatedShopDetails
        });
      } else {
        exits.invalidRequest(errorMessages.invalidRequest);
      }
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
