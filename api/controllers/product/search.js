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
    }
  },


  exits: {
    searchTermRequired: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },


  fn: async function (inputs) {
    const { searchTerm, selectedSuggestion, type = 'retail' } = inputs;

    if (!searchTerm || searchTerm.trim() === '') {
      throw exits.searchTermRequired(errorMessages.searchTermRequired);
    }
    let produtsBySuggestion;

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

      const productsBySuggestionPromise = new Promise((resolve, reject) => {
        Product.native(function(err, collection) {
          if (err) reject(err);
  
          collection
            .find(productsBySuggestionQuery, sails.config.custom.productProjection)
            .toArray(function (err, results) {
              if (err) reject(err);
              resolve(results);
            });
        });
      });

      try {
        let searchResultsByProduct = await productsBySuggestionPromise;
        produtsBySuggestion = searchResultsByProduct && searchResultsByProduct
          .map(product => sails.helpers.transformProduct(product));
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

    const resultsBySearchPromise = new Promise((resolve, reject) => {
      Product.native(function(err, collection) {
        if (err) reject(err);

        collection
          .find(searchQueryByProduct, sails.config.custom.productProjection)
          .toArray(function (err, results) {
            if (err) reject(err);
            resolve(results);
          });
      });
    });

    try {
      let resultsBySearch = await resultsBySearchPromise;
      let resultsByProduct = resultsBySearch && resultsBySearch
        .map(product => sails.helpers.transformProduct(product));

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
