const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
};

module.exports = {

  friendlyName: 'Edit Shop',

  description: 'Edit shop.',

  inputs: {
    shopId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    imageUrl: {
      type: 'string',
    },
    gpsLat: {
      type: 'number',
    },
    gpsLong: {
      type: 'number',
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

    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {
    const { shopId, name, phoneNumber, address, imageUrl, gpsLat, gpsLong } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    try {
      if (!shopId || (decodedData.type !== 'admin' && decodedData.type !== 'SALESMAN')) {
        exits.invalidRequest(errorMessages.invalidRequest);
        return;
      }

      let updateData = {};

      if (name) {
        updateData.name = name;
      }

      if (phoneNumber) {
        updateData.phoneNumber = phoneNumber;
      }

      if (address) {
        updateData.address = address;
      }

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      if (gpsLat) {
        updateData.gpsLat = gpsLat;
      }

      if (gpsLong) {
        updateData.gpsLong = gpsLong;
      }

      const updatedShop = await Shop.updateOne({ id: shopId })
        .set(updateData);

      if (updatedShop) {
        exits.successWithData(updatedShop);
      } else {
        exits.invalidRequest(errorMessages.invalidRequest);
      }
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }

  }
};
