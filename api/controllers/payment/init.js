const jwt = require('jsonwebtoken');

const errorMessages = {
  invalidAddress: 'Please select an address',
  checkoutSessionTimeout: 'Checkout session expired. Go back to cart and re-initiate checkout',
};

module.exports = {

  friendlyName: 'Init payment',

  description: 'Init payment.',

  inputs: {
    addressId: {
      type: 'string',
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    invalidAddress: {
      statusCode: 400,
      responseType: 'validationError',
    },

    checkoutSessionTimeout: {
      statusCode: 400,
      responseType: 'expired',
    },
  },

  fn: async function (inputs, exits) {
    const { addressId } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!addressId) {
      exits.invalidAddress(errorMessages.invalidAddress);
    }

    // check if address is valid and exists in db
    const selectedAddress = await Address.findOne({
      userId: decodedData.id,
      addressId
    });

    if (!selectedAddress) {
      exits.invalidAddress(errorMessages.invalidAddress);
    }

    // check if there are any reservations
    const reservations = await Reservation.find({ userId: decodedData.id });

    if (!reservations || reservations.length === 0) {
      exits.checkoutSessionTimeout(errorMessages.checkoutSessionTimeout);
    }

    exits.successWithData(reservations);
  }
};
