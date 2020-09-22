const errorMessages = {
  searchTermRequired: "Please provide a search term to search with."
};

module.exports = {


  friendlyName: 'Search',


  description: 'Search product.',


  inputs: {
    type: {
      type: 'string'
    },
    searchTerm: {
      type: 'string'
    },
    selectedSuggestion: {
      type: 'string'
    },
    price: {
      type: 'json'
    },
  },


  exits: {
    searchTermRequired: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },


  fn: async function (inputs) {
    const { searchTerm, selectedSuggestion, type = 'retail', price } = inputs;

    if (!searchTerm || searchTerm.trim() === '') {
      throw exits.searchTermRequired(errorMessages.searchTermRequired);
    }

    let produtsBySuggestion;
    let priceQuery;
    let productProjection = sails.config.custom.productProjection;

    if (price && (price.min || price.max)) {
      price.min = price.min || 0;
      price.max = price.max || 999999;
      const priceCondition = { price: { $gte: price.min, $lte: price.max } };
      priceQuery = { $elemMatch: priceCondition };
    }

    if (selectedSuggestion) {
      const productsBySuggestionQuery = {
        $or: [
          { productName: { $regex: new RegExp(`^${selectedSuggestion}`, 'i') } },
          { category: { $regex: new RegExp(`^${selectedSuggestion}`, 'i') } },
          { brand: { $regex: new RegExp(`^${selectedSuggestion}`, 'i') } },
          { description: { $regex: new RegExp(`${selectedSuggestion}`, 'i') } },
          { keywords: { $regex: new RegExp(`^${selectedSuggestion}`, 'i') } },
        ],
        isActive: true,
        marketPlaces: { $in: [ type ] }
      };

      if (priceQuery) {
        productsBySuggestionQuery.buyingOptions = priceQuery;
      }

      const productsBySuggestionPromise = new Promise((resolve, reject) => {
        Product.native(function(err, collection) {
          if (err) reject(err);
  
          collection
            .find(productsBySuggestionQuery, productProjection)
            .toArray(function (err, results) {
              if (err) reject(err);
              resolve(results);
            });
        });
      });

      try {
        let searchResultsByProduct = await productsBySuggestionPromise;
        produtsBySuggestion = searchResultsByProduct && searchResultsByProduct
          .map(product => sails.helpers.transformProduct(product, price));
      } catch(e) {}
    }

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

    if (priceQuery) {
      searchQueryByProduct.buyingOptions = priceQuery;
    }

    const resultsBySearchPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection
          .find(searchQueryByProduct, productProjection)
          .toArray(function (err, results) {
            if (err) reject(err);
            resolve(results);
          });
      });
    });

    try {
      let resultsBySearch = await resultsBySearchPromise;
      let resultsByProduct = resultsBySearch && resultsBySearch
        .map(product => sails.helpers.transformProduct(product, price));

      if (produtsBySuggestion && produtsBySuggestion.length > 0) {
        for(let i=0; i<produtsBySuggestion.length; i++) {
          if (!resultsBySearch.find(p => p.productId === produtsBySuggestion[i].productId)) {
            resultsByProduct.unshift(produtsBySuggestion[i]);
          }
        }
      }

      this.res.json({
        code: 'success',
        data: resultsByProduct
      })
    } catch(e) {
      this.res.json({ code: 'SERVER_ERROR' });
    }
  }


};
