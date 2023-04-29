const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  locationExists: 'Location already exists'
};

module.exports = {

  friendlyName: 'Add',

  description: 'Add location.',

  inputs: {
    name: {
      type: 'string'
    }
  },

  exits: {
    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },

    locationExists: {
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
      const { name } = inputs;

      const existingLocationQuery = { name: new RegExp(`${name}`, 'i') };
      const existingLocationPromise = new Promise((resolve, reject) => {
        Location.native(function(err, collection) {
          if (err) reject(err);
  
          collection
            .find(existingLocationQuery)
            .toArray(function (err, results) {
              if (err) reject(err);
              resolve(results);
            });
        });
      });

      const existingLocation = await existingLocationPromise;

      if (existingLocation && existingLocation.length > 0) {
        exits.locationExists(errorMessages.locationExists);
        return;
      }

      const location = await Location.create({ name }).fetch();

      this.res.json({
        code: 'success',
        data: location,
      });
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
