const jwt = require('jsonwebtoken');

const errorMessages = {
  invalidRequest: 'Invalid request.',
  productDoesNotExist: 'Product does not exist.',
  invalidQuantity: 'Invalid product quantity.',
  invalidUnit: "Buying option with this unit does not exist",
  invalidPreference: "This option is not applicable on this product",
  outOfStock: "Product out of stock",
  limitedQuantityAvailable: " quantity of this product available"
}

module.exports = {

  friendlyName: 'Update Cart',

  description: 'Update Cart.',

  inputs: {
    productId: {
      type: 'string'
    },
    quantity: {
      type: 'number'
    },
    unit: {
      type: 'string'
    },
    preference: {
      type: 'string'
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    invalidRequest: {
      statusCode: 400,
      responseType: 'validationError',
    },

    productDoesNotExist: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidQuantity: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidUnit: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidPreference: {
      statusCode: 400,
      responseType: 'validationError',
    },

    outOfStock: {
      statusCode: 400,
      responseType: 'validationError',
    },

    limitedQuantityAvailable: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { productId, quantity, unit, preference } = inputs;

    if (!productId || quantity === undefined) {
      throw exits.invalidRequest(errorMessages.invalidRequest);
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      throw exits.productDoesNotExist(errorMessages.productDoesNotExist);
    }

    if (quantity < 0 || isNaN(quantity)) {
      throw exits.invalidQuantity(errorMessages.invalidQuantity);
    }

    let currentBuyingOption = product.buyingOptions.find(bo => bo.unit === unit);
    let currentPreference = product.preferences.find(pref => pref === preference);

    if (!unit || !currentBuyingOption) {
      throw exits.invalidUnit(errorMessages.invalidUnit);
    }

    if (preference && !currentPreference) {
      throw exits.invalidPreference(errorMessages.invalidPreference);
    }

    // check inventory
    const inventoryCount = Number(currentBuyingOption.inventory);

    if (isNaN(inventoryCount) || inventoryCount === 0) {
      throw exits.outOfStock(errorMessages.outOfStock);
    } else if (inventoryCount < quantity) {
      throw exits.limitedQuantityAvailable(
        "Only " + inventoryCount + errorMessages.limitedQuantityAvailable
      );
    }

    // allow add to cart
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    const existingCartData = await Cart.findOne({ userId: decodedData.id });
    const products = (existingCartData && existingCartData.products) || [];
    let updatedCart;

    // if user doesn't have any existing cart data, create one.
    if (!existingCartData) {
      // if the quantity is anyways 0, nothing needs to be added to cart.
      // just send empty response
      if (quantity === 0) {
        exits.successWithData(products);
      }

      // if quantity is greater than zero then add it to cart
      products.push({ productId, unit, preference, quantity });

      updatedCart = await Cart.create({
        userId: decodedData.id,
        products,
      })
    } else {
      const productIndex = products.findIndex(p => p.productId === productId && p.unit === unit);

      // if the product was earlier added to cart
      // but its quantity is changed to zero 
      // then remove the product from cart
      if (productIndex > -1) {
        if (quantity === 0) {
          products.splice(productIndex, 1);
        } else {
          products[productIndex] = { productId, unit, preference, quantity };
        }
      } else {
        // add product to list only if the quantity is greater than zero.
        if (quantity > 0) {
          products.push({ productId, unit, preference, quantity });
        }
      }

      updatedCart = await Cart.updateOne({ userId: decodedData.id })
        .set({ products });
    }

    exits.successWithData(products)
  }

};
