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

      if (currentConfig && inputs.type && currentConfig[inputs.type]) {
        this.res.json({
          code: "success",
          data: {
            ...currentConfig[inputs.type],
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
