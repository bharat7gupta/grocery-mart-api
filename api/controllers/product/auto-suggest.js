const jwt = require('jsonwebtoken');

const errorMessages = {
  searchTermRequired: "Please provide a search term to search with."
};

module.exports = {

  friendlyName: 'Auto suggest',

  description: '',

  inputs: {
    searchTerm: {
      type: 'string'
    }
  },

  exits: {
    searchTermRequired: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },

  fn: async function (inputs, exits) {
    const { searchTerm } = inputs;

    if (!searchTerm || searchTerm.trim() === '') {
      throw exits.searchTermRequired(errorMessages.searchTermRequired);
    }

    const decoded = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    const type = decoded.type;

    const searchQueryByProduct = {
      $or: [
        { productName: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
        { category: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
        { brand: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
        { description: { $regex: new RegExp(`${searchTerm}`, 'i') } },
        { keywords: { $regex: new RegExp(`^${searchTerm}`, 'i') } },
      ],
      isActive: true,
      marketPlaces: { $in: [ type ] }
    };

    const resultsByProductPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection
          .find(searchQueryByProduct, { productName: true, _id: false })
          .limit(10)
          .toArray(function (err, results) {
            if (err) reject(err);
            resolve(results);
          });
      });
    });

    try {
      let searchResultsByCategory = [];
      let searchResultsByProduct = await resultsByProductPromise;
      const resultsByProduct = searchResultsByProduct && searchResultsByProduct
        .map(product => product.productName);

      this.res.json({
        code: 'success',
        data: resultsByProduct
        // data: {
        //   byCategory: searchResultsByCategory,
        //   byProduct: resultsByProduct,
        // }
      })
    } catch(e) {
      this.res.json({ code: 'SERVER_ERROR' });
    }
  }

};
