const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Get saved addresses for a particular user',

  description: 'Get saved addresses for a particular user',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {

    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    const addresses = await Address.find({ userId: decodedData.id });
    const mappedAddresses = addresses.map(address => {
      const { id, createdAt, updatedAt, ...addressParams } = address;
      return addressParams;
    });

    exits.successWithData(mappedAddresses);
  }
};
