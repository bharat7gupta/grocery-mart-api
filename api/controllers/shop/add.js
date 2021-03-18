const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
};

module.exports = {

  friendlyName: 'Create shop.',

  description: 'Create shop.',

  inputs: {
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
    }
  },

  fn: async function (inputs, exits) {
    const { name, phoneNumber, address, imageUrl, gpsLat, gpsLong } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    let status = constants.SHOP_STATUS.UNCONFIRMED;

    if (decodedData.type !== 'admin' && decodedData.type !== 'SALESMAN') {
      exits.invalidRequest(errorMessages.invalidRequest);
    } else {
      status = decodedData.type === 'admin' ? constants.SHOP_STATUS.CONFIRMED : status;
    }

    try {
      const shop = await Shop.create({
        name,
        phoneNumber,
        address,
        imageUrl,
        gpsLat,
        gpsLong,
        createdBy: decodedData.id,
        status
      }).fetch();

      this.res.json({
        code: 'success',
        data: shop,
      });
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
