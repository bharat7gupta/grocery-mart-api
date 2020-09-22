module.exports = {

  friendlyName: 'Save Product - Create or Edit',

  description: 'Save product - Create or Edit. If product id is provided then we edit the product else we create a new one',

  inputs: {
    productId: {
      type: 'string'
    },
    marketPlaces: {
      type: 'json'
    },
    productName: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    brand: {
      type: 'string'
    },
    productImage: {
      type: 'string'
    },
    buyingOptions: {
      type: 'json'
    },
    preferences: {
      type: 'json'
    },
    keywords: {
      type: 'json'
    },
    keyFeatures: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    disclaimer: {
      type: 'string'
    },
    isActive: {
      type: 'boolean'
    }
  },


  exits: {
    invalid: {
      statusCode: 400,
      responseType: 'badRequest',
    }
  },

  fn: async function (inputs, exits) {
    try {
      if (inputs.productId) { // editing existing product
        const updatedProduct = await Product.updateOne({ productId: inputs.productId })
          .set(inputs);

        const { createdAt, updatedAt, id, ...rest } = updatedProduct;

        this.res.json({ code: "success", data: rest });
        return;
      }
      else { // create new product
        const productId = '_' + Math.random().toString(36).substr(2, 9) + '_';
        var newProduct = await Product.create({
          ...inputs,
          productId
        })
        .intercept({name: 'UsageError'}, 'invalid')
        .fetch();

        const { createdAt, updatedAt, id, ...rest } = newProduct;

        this.res.json({ code: "success", data: rest });
        return;
      }
    }
    catch(e) {
      this.res.json({ code: "error", message: "Something went wrong. Please try again!" });
    }
  }

};
