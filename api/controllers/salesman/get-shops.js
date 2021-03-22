const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Get All shops created by or assigned to a salesman',

  description: 'Get All shops created by or assigned to a salesman',

  inputs: {

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
    try {
      const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

      const salesman = await User.findOne({ id: decodedData.id, userType: constants.USER_TYPES.SALESMAN });
      const { locationId } = salesman;

      const shops = await Shop.find({ locationId });

      exits.successWithData(shops);
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
