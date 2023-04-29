const jwt = require('jsonwebtoken');

const errorMessages = {
  categoryRequired: "Please provide a category to look for."
};

module.exports = {

  friendlyName: 'Category',

  description: 'Category product.',

  inputs: {
    type: {
      type: 'string'
    },
    category: {
      type: 'string'
    }
  },

  exits: {
    categoryRequired: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },

  fn: async function (inputs, exits) {
    const category = inputs.category;

    if (!category) {
      throw exits.categoryRequired(errorMessages.categoryRequired);
    }

    const decoded = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    const type = decoded.type === 'DEFAULT' ? 'retail' : decoded.type;

    const searchQuery = {
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      isActive: true,
      marketPlaces: { $in: [ type ] }
    };

    const productsPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection.find(searchQuery, sails.config.custom.productProjection)
          .toArray(function (err, results) {
            if (err) reject(err);
            resolve(results);
          });
      });
    });

    try {
      const products = await productsPromise;
      const productSet = products && products
        .map(product => sails.helpers.transformProduct(product));

      this.res.json({ code: 'success', data: productSet });
    } catch(e) {
      this.res.json({ code: 'SERVER_ERROR' });
    }
  }
};
