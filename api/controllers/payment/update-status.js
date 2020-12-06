const jwt = require('jsonwebtoken');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
};

module.exports = {

  friendlyName: 'Update status',

  description: '',

  inputs: {
    status: {
      type: 'string',
    },
    paymentMode: {
      type: 'string',
    }
  },

  exits: {
    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },

    invalidRequest: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { status, paymentMode } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!status) {
      exits.invalidRequest(errorMessages.invalidRequest);
    }

    try {
      // get all reservations for the current user
      const cartState = await Cart.findOne({ userId: decodedData.id });
      const cartStateProducts = (cartState && cartState.products) || [];
      const productIds = cartStateProducts.map(r => r.productId);
      const products = await Product.find({ productId : productIds });

      const productsWithBuyingOption = products.map(p => {
        const inCartProduct = cartStateProducts.find(pr => pr.productId === p.productId);
        const { id, buyingOptions, preferences, ...restProps } = p;
        const buyingOption = buyingOptions.find(bo => bo.unit === inCartProduct.unit);
        const { inventory, ...restBuyingOption } = buyingOption;

        return {
          ...restProps,
          buyingOption: restBuyingOption,
          quantity: inCartProduct.quantity,
        };
      });

      // create order entry
      const order = await Order.create({
        status,
        paymentMode,
        products: cartStateProducts,
        priceSummary: sails.helpers.getPriceSummary(productsWithBuyingOption),
      }).fetch();

      // delete reservations
      await Reservation.destroy({ userId: decodedData.id });

      if (status === 'FAILED') {
        this.res.json({
          code: 'goBackToCart',
          message: 'Payment Failed. Please go back to cart and re-initiate checkout',
        })
      } else if (status === 'SUCCESS') {
        // clear cart
        await Cart.destroy({ userId: decodedData.id });

        this.res.json({
          code: 'success',
          data: order,
        });
      }

      throw new Error();
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
