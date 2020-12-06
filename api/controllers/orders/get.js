const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Get orders.',

  description: 'Get orders.',

  inputs: {

  },

  exits: {

  },

  fn: async function (inputs) {
    try {
      const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
      const userId = decodedData.id;
      const orders = await Order.find({ userId });

      const productIds = orders.reduce((acc, curr) => {
        const orderProductIds = curr.products.map(p => p.productId);

        for (let i=0; i<orderProductIds.length; i++) {
          if (!acc.find(id => id === orderProductIds[i])) {
            acc.push(orderProductIds[i]);
          }
        }

        return acc;
      }, []);

      const projetion = sails.config.custom.productProjection;
      const allowedFields = Object.keys(sails.config.custom.productProjection).filter(t => !!projetion[t]);

      const products = await Product.find({
        where: { productId : productIds },
        select: allowedFields
      });

      const orderWithProductDetails = orders.map(o => {
        const productsWithDetails = o.products.map(p => {
          const product = products.find(pr => pr.productId === p.productId);
          const { id, buyingOptions, preferences, ...restProps } = product;
          const buyingOption = buyingOptions.find(bo => bo.unit === p.unit);
          const { inventory, ...restBuyingOption } = buyingOption;

          return {
            ...restProps,
            buyingOption: restBuyingOption,
            quantity: p.quantity,
          };
        });

        return { ...o, products: productsWithDetails };
      });

      this.res.json({
        code: 'success',
        data: orderWithProductDetails
      })
    } catch (e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }

};
