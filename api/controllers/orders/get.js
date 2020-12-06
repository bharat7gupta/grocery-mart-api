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

      this.res.json({
        code: 'success',
        data: orders
      })
    } catch (e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }

};
