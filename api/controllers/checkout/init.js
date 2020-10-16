const jwt = require('jsonwebtoken');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  emptyCart: 'Cart is empty. No products to checkout.',
  someOutOfStock: 'Some products are out of stock',
  allOutOfStock: 'All products are out of stock',
};

module.exports = {

  friendlyName: 'Init checkout.',

  description: 'Init checkout.',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    emptyCart: {
      statusCode: 400,
      responseType: 'validationError',
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

      // exit if cart is empty
      if (cartStateProducts.length === 0) {
        exits.emptyCart(errorMessages.emptyCart);
      }

      // delete previous reservations on checkout init
      const productIds = cartStateProducts.map(p => p.productId);
      await Reservation.destroy({ userId: decodedData.id, productId: { in: productIds } });

      // check if products exist in inventory
      const products = await Product.find({ productId : productIds });

      const outOfStockProducts = cartStateProducts.reduce((acc, current) => {
        const product = products.find(p => p.productId === current.productId);
        const buyingOption = product && product.buyingOptions.find(bo => bo.unit === current.unit);

        if (buyingOption && buyingOption.unit < current.unit) {
          acc.push(current);
        }

        return acc;
      }, []);

      // exit if some or all products are out of stock
      if (outOfStockProducts.length > 0 && outOfStockProducts.length === cartStateProducts.length) {
        this.res.json({ code: 'allOutOfStock', data: outOfStockProducts, message: errorMessages.allOutOfStock });
      } else if (outOfStockProducts.length > 0 && outOfStockProducts.length < cartStateProducts.length) {
        this.res.json({ code: 'someOutOfStock', data: outOfStockProducts, message: errorMessages.someOutOfStock });
      }

      // reserve products for user
      const reservedProducts = await Reservation.createEach(
        cartStateProducts.map(cp => ({ ...cp, userId: decodedData.id }))
      ).fetch();

      const reservedProductsMapped = reservedProducts.map(rp => {
        const { id, createdAt, updatedAt, userId, ...otherProps } = rp;
        return otherProps;
      });

      // get user addresses
      const addresses = await Address.find({ userId: decodedData.id });
      const mappedAddresses = addresses.map(address => {
        const { id, createdAt, updatedAt, userId, ...addressParams } = address;
        return addressParams;
      });

      // get price summary
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

      exits.successWithData({
        products: reservedProductsMapped,
        addresses: mappedAddresses,
        priceSummary: sails.helpers.getPriceSummary(productsWithBuyingOption),
      });
    } catch(e) {
      exits.serverError(errorMessages.serverError);
    }
  }
};
