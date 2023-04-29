const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Delete address',

  description: 'Delete address.',

  inputs: {
    addressId: {
      type: 'string',
    },
  },

  exits: {

  },

  fn: async function (inputs) {
    try {
      const { addressId } = inputs;
      const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
      const deletedAddress = await Address.destroyOne({ userId: decodedData.id, addressId });

      this.res.json({
        code: 'success',
        message: 'Address deleted successfully!'
      });
    } catch (e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }

  }

};
