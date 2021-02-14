const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Get driver assigned orders',

  description: 'Get driver assigned orders',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {
    try {

      const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
      const driverId = decodedData.id;

      const orders = await Order.find({
        status: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
        driverId
      });

      const userIds = orders.map(o => o.userId);
      const users = await User.find({ id: userIds });
      const addressses = await Address.find({ userId: userIds });

      const orderWithDetails = orders.map(o => {
        const user = users.find(u => u.id === o.userId);
        const address = addressses.find(a => a.addressId === o.addressId);

        return {
          orderId: o.id,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          username: user.username,
          address: address,
          status: o.status,
          customerSignature: o.customerSignature
        }
      });

      exits.successWithData(orderWithDetails);
    } catch (e) {
      this.res.json({
				code: 'SERVER_ERROR',
				message: 'Something went wrong. Please try again!'
			});
    }
  }
};
