var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Get all',

  description: '',

  inputs: {

  },

  exits: {
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
    try {
      const salesmen = await User.find({
        userType: constants.USER_TYPES.SALESMAN,
      });

      const transformedData = (salesmen || []).map(s => ({
        id: s.id,
        username: s.username,
        email: s.email,
        mobile: s.mobile,
        userType: s.userType,
        accountStatus: s.accountStatus,
        altPhoneNumber: s.altPhoneNumber,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));

      exits.successWithData(transformedData);
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
