
const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
};

module.exports = {

  friendlyName: 'Get all',

  description: '',

  inputs: {
    locationId: {
      type: 'string'
    }
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
      const { locationId } = inputs;
      const shops = await Shop.find({ locationId }).sort('position ASC');

      exits.successWithData(shops);
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
