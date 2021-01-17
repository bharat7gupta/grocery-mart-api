module.exports = {

  friendlyName: 'Get customers',

  description: 'Get customers.',

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
      const users = await User.find({ isAdmin: false, userType: 'DRIVER', accountStatus: 'CONFIRMED' });

      const mappedUsers = users.map(user => sails.helpers.transformUser(user));

      exits.successWithData(mappedUsers);
    } catch(e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }
};
