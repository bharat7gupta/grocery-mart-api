
const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
};

module.exports = {

  friendlyName: 'Get all locations',

  description: 'Get all locations',

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
      const locations = await Location.find().sort('name ASC');

      exits.successWithData(locations);
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
