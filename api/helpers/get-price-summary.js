module.exports = {

  friendlyName: 'Get price summary',

  description: '',

  inputs: {
    products: {
      type: 'json'
    }
  },

  sync: true,

  exits: {
    success: {
      outputFriendlyName: 'Price summary',
    },
  },

  fn: function (inputs) {

    const products = inputs.products || [];
    const initialPriceSummary = { totalMRP: 0, payableAmount: 0 };

    const priceSummary = products.reduce((acc, currentProduct) => {
      const { quantity } = currentProduct;
      const { mrp, price } = currentProduct.buyingOption;
      const totalMRP = acc.totalMRP + Number(mrp) * quantity;
      const payableAmount = acc.payableAmount + Number(price) * quantity;

      return { totalMRP, payableAmount };
    }, initialPriceSummary);

    // Send back the result through the success exit.
    return priceSummary;
  }

};
