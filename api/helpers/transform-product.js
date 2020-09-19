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
      const buyingOptions = inputs.product.buyingOptions.map(buyingOption => {
        const { inventory, isWholesale, ...restParams } = buyingOption;
        restParams.inStock = !!inventory && Number(inventory) > 0
        return restParams;
      });

      return { ...inputs.product, buyingOptions, id: undefined }
    }
    
    return null;
  }

};

