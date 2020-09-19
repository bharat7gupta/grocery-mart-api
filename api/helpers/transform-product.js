module.exports = {
  friendlyName: 'Transform product',

  description: '',

  inputs: {
    product: {
      type: 'json'
    }
  },

  sync: true,

  exits: {
    success: {
      description: 'All done.',
    },
  },

  fn: function (inputs) {
    if (inputs.product) {
      const buyingOptions = product.buyingOptions.map(buyingOption => {
        const { inventory, isWholesale, ...restParams } = buyingOption;
        restParams.inStock = !!inventory && Number(inventory) > 0
        return restParams;
      });

      return { ...product, buyingOptions }
    }
    
    return null;
  }

};

