const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
  invalidSalesmanId: 'Invalid Salesman Id'
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
    salesmanId: {
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

    invalidSalesmanId: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { shopId, status, salesmanId } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!shopId || !status || decodedData.type !== 'admin') {
      exits.invalidRequest(errorMessages.invalidRequest);
      return;
    }

    let updatedData = { status };

    try {
      if (status === constants.SHOP_STATUS.CONFIRMED) {
        if (!salesmanId) {
          exits.invalidSalesmanId(errorMessages.invalidSalesmanId);
          return;
        }

        const salesman = await User.findOne({
          id: salesmanId,
          userType: constants.USER_TYPES.SALESMAN,
          accountStatus: constants.ACCOUNT_STATUS.CONFIRMED
        });
  
        if (!salesman) {
          exits.invalidSalesmanId(errorMessages.invalidSalesmanId);
          return;
        } else {
          updatedData.salesmanId = salesman.id;
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
