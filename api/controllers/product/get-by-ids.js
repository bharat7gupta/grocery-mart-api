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

    const projetion = sails.config.custom.productProjection;
    const allowedFields = Object.keys(sails.config.custom.productProjection).filter(t => !!projetion[t]);
    const products = await Product.find({
      where: { productId : inputs.productIds },
      select: allowedFields
    });

    this.res.json({
      code: 'success',
      data: products.map(product => sails.helpers.transformProduct(product))
    });

  }


};
