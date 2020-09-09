const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Get all home page configs',

  description: '',

  inputs: {

  },

  exits: {
    sendData: {
      statusCode: 200,
      responseType: 'success',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },
  },

  fn: async function (inputs, exits) {

    const config = await HomePageConfig.find();

    if (config && config.length > 0) {
      let currentConfig = config[0];
      delete currentConfig.id;
      delete currentConfig.createdAt;
      delete currentConfig.updatedAt;
      this.res.json({ code: "success", data: currentConfig });
      return;
    }

    throw exits.serverError(errorMessages.serverError);

  }

};
