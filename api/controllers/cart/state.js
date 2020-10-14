const jwt = require('jsonwebtoken');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Get Cart State',

  description: 'Get Cart State',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {

    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    try {
      const cartState = await Cart.findOne({ userId: decodedData.id });
      const cartStateProducts = (cartState && cartState.products) || [];
      const projetion = sails.config.custom.productProjection;
      const allowedFields = Object.keys(sails.config.custom.productProjection).filter(t => !!projetion[t]);
      const productIds = cartStateProducts.map(p => p.productId);

      const products = await Product.find({
        where: { productId : productIds },
        select: allowedFields
      });

      const productsWithQuantity = products.map(p => {
        const inCartProduct = cartStateProducts.find(pr => pr.productId === p.productId);
        const { id, buyingOptions, preferences, ...restProps } = p;

        return {
          ...restProps,
          buyingOption: buyingOptions.find(bo => bo.unit === inCartProduct.unit),
          preference: preferences.find(pref => pref === inCartProduct.preference),
          quantity: inCartProduct.quantity,
        };
      });

      exits.successWithData({ products: productsWithQuantity });
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
