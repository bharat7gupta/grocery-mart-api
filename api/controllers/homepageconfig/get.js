const jwt = require('jsonwebtoken');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Get all home page configs',

  description: '',

  inputs: {
    type: {
      type: 'string'
    }
  },

  exits: {
    sendData: {
      statusCode: 200,
      responseType: 'success',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    let userType;

    if (decodedData.type) {
      userType = decodedData.type === 'DEFAULT' ? 'retail' : decodedData.type.toLowerCase();
    } else {
      userType = inputs.type;
    }

    const categoriesPromise = new Promise((resolve) => {
      Product.native(function(err, collection) {
        collection.distinct('category', function(err, categories) {
          resolve(categories.filter(c => !!c));
        });
      });
    });

    const brandsPromise = new Promise((resolve) => {
      Product.native(function(err, collection) {
        collection.distinct('brand', function(err, brands) {
          resolve(brands.filter(b => !!b));
        });
      });
    });

    const config = await HomePageConfig.find();
    const categories = await categoriesPromise;
    const brands = await brandsPromise;
    

    if (config && config.length > 0) {
      const currentConfig = config[0];
      const preferences = currentConfig.preferences;

      if (currentConfig && userType && currentConfig[userType]) {
        this.res.json({
          code: "success",
          data: {
            ...currentConfig[userType],
            categories,
            brands,
            preferences
          }
        });
        return;
      }
    }

    throw exits.serverError(errorMessages.serverError);

  }

};
