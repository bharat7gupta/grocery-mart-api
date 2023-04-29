var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Update locations',

  description: '',

  inputs: {
    salesmanId: {
      type: 'string',
    },

    locationIds: {
      type: 'json'
    }
  },

  exits: {
    invalidRequest: {
      statusCode: 400,
      responseType: 'validationError',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },

    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {
    const { salesmanId, locationIds } = inputs;

    try {
      let updatedData = { locationIds };

      const updatedSalesmanDetails = await User.updateOne({
        id: salesmanId,
        userType: constants.USER_TYPES.SALESMAN
      }).set(updatedData);

      if (updatedSalesmanDetails) {
        const { id, email, mobile, userType, accountStatus, altPhoneNumber, locationIds, createdAt, updatedAt } = updatedSalesmanDetails;

        this.res.json({
          code: 'success',
          data: { id, email, mobile, userType, accountStatus, altPhoneNumber, locationIds, createdAt, updatedAt }
        });
      } else {
        exits.invalidRequest(errorMessages.invalidRequest);
      }

    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
