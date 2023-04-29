module.exports = {

  friendlyName: 'Get',

  description: 'Get product.',

  inputs: {

  },

  exits: {

  },

  fn: async function (inputs) {

    const products = await Product.find()
      .sort('updatedAt DESC')
      .limit(50);

    this.res.json({
      code: 'success',
      data: products.map(product => {
        const { createdAt, updatedAt, id, ...rest } = product;
        return rest;
      })
    });
  }

};
