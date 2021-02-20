const jwt = require('jsonwebtoken');

const errorMessages = {
  searchTermRequired: "Please provide a search term to search with."
};

module.exports = {

  friendlyName: 'Search',

  description: 'Search product.',

  inputs: {
    searchTerm: {
      type: 'string'
    },
    selectedSuggestion: {
      type: 'string'
    },
    price: {
      type: 'json'
    },
    start: {
      type: 'number'
    },
    end: {
      type: 'number'
    },
    brands: {
      type: 'json'
    },
    excludeOutOfStock: {
      type: 'boolean'
    }
  },

  exits: {
    searchTermRequired: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },

  fn: async function (inputs) {
    const { searchTerm, selectedSuggestion, price, excludeOutOfStock = false } = inputs;

    if (!searchTerm || searchTerm.trim() === '') {
      throw exits.searchTermRequired(errorMessages.searchTermRequired);
    }

    const decoded = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    const type = decoded.type;

    // setup input defaults
    let priceQuery;
    let start = inputs.start || 0;
    let end = inputs.end || 30;
    let productProjection = sails.config.custom.productProjection;

    if (price && (price.min || price.max)) {
      price.min = price.min || 0;
      price.max = price.max || 999999;
      const priceCondition = { price: { $gte: price.min, $lte: price.max } };
      priceQuery = { $elemMatch: priceCondition };
    }

    // query db for results
    const searchQuery = {
      $or: [
        { productName: { $regex: new RegExp(`^${selectedSuggestion}|${searchTerm}`, 'i') } },
        { category: { $regex: new RegExp(`^${selectedSuggestion}|${searchTerm}`, 'i') } },
        { brand: { $regex: new RegExp(`^${selectedSuggestion}|${searchTerm}`, 'i') } },
        { description: { $regex: new RegExp(`${selectedSuggestion}|${searchTerm}`, 'i') } },
        { keywords: { $regex: new RegExp(`^${selectedSuggestion}|${searchTerm}`, 'i') } },
      ],
      isActive: true,
      marketPlaces: { $in: [ type ] }
    };

    const brandsQuery = { ...searchQuery };

    if (priceQuery) {
      searchQuery.buyingOptions = priceQuery;
    }

    if (inputs.brands && inputs.brands.length > 0) {
      searchQuery.brand = { $in: inputs.brands }
    }

    const searchResultPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection
          .find(searchQuery, productProjection)
          .skip(start)
          .limit(end - start)
          .toArray(function (err, results) {
            if (err) reject(err);
            resolve(results);
          });
      });
    });

    // get all available brands
    const brandsPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection
          .distinct('brand', brandsQuery, function (err, brands) {
            if (err) reject(err);
            resolve(brands);
          })
      });
    });

    try {
      let searchResultsData = await searchResultPromise;
      const brands = await brandsPromise;

      let searchResults = searchResultsData && searchResultsData
        .map(product => sails.helpers.transformProduct(product, price, excludeOutOfStock))
        .filter(product => !(excludeOutOfStock && product.buyingOptions.length === 0));

      this.res.json({
        code: 'success',
        data: {
          results: searchResults,
          brands
        }
      });
    } catch(e) {
      this.res.json({ code: 'SERVER_ERROR' });
    }
  }
};
