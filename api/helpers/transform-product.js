module.exports = {
  friendlyName: 'Transform product',

  description: '',

  inputs: {
    product: {
      type: 'json'
    },
    price: {
      type: 'json'
    },
    excludeOutOfStock: {
      type: 'boolean'
    }
  },

  sync: true,

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function (inputs) {
    const { product, price, excludeOutOfStock } = inputs;

    if (product) {
      let buyingOptions = inputs.product.buyingOptions;

      if (price) {
        buyingOptions = buyingOptions.filter(bo => {
          return bo.price >= price.min && bo.price <= price.max
        });
      }

      buyingOptions = buyingOptions.map(buyingOption => {
        const { inventory, isWholesale, ...restParams } = buyingOption;
        restParams.inStock = !!inventory && Number(inventory) > 0
        return restParams;
      })
      .filter(buyingOption => !(excludeOutOfStock && !buyingOption.inStock));

      return { ...inputs.product, buyingOptions, id: undefined }
    }
    
    return null;
  }

};

