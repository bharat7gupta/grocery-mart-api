module.exports = {

  friendlyName: 'Update status',

  description: 'update customer account status',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    accountStatus: {
      type: 'string',
      required: true,
    },
    route: {
      type: 'string'
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {
    const { id, accountStatus, route } = inputs;
    let updateData = { accountStatus };

    if (route) {
      updateData.route = route;
    }

    try {
      const updatedUser = await User.updateOne({ id, isAdmin: false, userType: { '!=': 'DEFAULT' } })
        .set(updateData);

      exits.successWithData(updatedUser);
    } catch (e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }

};
