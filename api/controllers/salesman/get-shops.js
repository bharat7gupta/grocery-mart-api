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

      const searchQuery = {
        $or: [
          { createdBy: decodedData.id },
          { salesmanId: decodedData.id }
        ]
      };

      const shopsResultPromise = new Promise((resolve, reject) => {
        Shop.native(function(err, collection) {
          if (err) reject(err);
  
          collection
            .find(searchQuery)
            .toArray(function (err, results) {
              if (err) reject(err);
              resolve(results);
            });
        });
      });

      const shops = await shopsResultPromise;

      exits.successWithData(shops);
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
