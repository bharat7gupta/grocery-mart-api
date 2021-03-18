const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
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
    const { shopId, status } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!shopId || !status || decodedData.type !== 'admin') {
      exits.invalidRequest(errorMessages.invalidRequest);
      return;
    }

    try {
      let updatedData = { status };
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
