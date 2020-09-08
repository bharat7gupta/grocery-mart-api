module.exports = {


  friendlyName: 'Get by ids',


  description: '',


  inputs: {
    productIds: {
      type: 'json'
    }
  },


  exits: {

  },


  fn: async function (inputs) {

    if (!inputs.productIds || inputs.productIds.length === 0) {
      this.res.json({ code: 'success', data: [] });
    }

    const products = await Product.find({ productId : inputs.productIds });

    this.res.json({
      code: 'success',
      data: products.map(product => {
        const { createdAt, updatedAt, id, ...rest } = product;
        return rest;
      })
    });

  }


};
