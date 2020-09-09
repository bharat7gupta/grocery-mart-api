module.exports = {

  friendlyName: 'Set config',

  description: '',

  inputs: {
    key: {
      type: 'string'
    },
    altText: {
      type: 'string'
    },
    navigatingUrl: {
      type: 'string'
    },
    secure_url: {
      type: 'string'
    },
    productId: {
      type: 'string'
    },
    sectionIndex: {
      type: 'number'
    }
  },

  exits: {
    somethingWentWrong: {
      statusCode: 500,
			responseType: 'validationError',
    },
  },

  fn: async function (inputs) {

    const config = await HomePageConfig.find();

    if (config && config.length > 0) {
      const currentConfig = config[0];
      let updatedConfig;

      if (inputs.navigatingUrl && inputs.secure_url) {
        updatedConfig = await HomePageConfig.updateOne({ id: currentConfig.id })
          .set({
            ...currentConfig,
            [inputs.key]: {
              altText: inputs.altText,
              navigatingUrl: inputs.navigatingUrl,
              secure_url: inputs.secure_url
            }
          });
      }
      else if (["feature-products", "most-popular-products", "offer-products"].indexOf(inputs.key) >= 0) {
        if (inputs.sectionIndex !== "" && inputs.sectionIndex !== undefined && !isNaN(inputs.sectionIndex)) {
          let products = currentConfig[inputs.key];
          products[inputs.sectionIndex] = inputs.productId;

          updatedConfig = await HomePageConfig.updateOne({ id: currentConfig.id })
            .set({
              ...currentConfig,
              [inputs.key]: products
            });
        }
        else {
          updatedConfig = await HomePageConfig.updateOne({ id: currentConfig.id })
            .set({
              ...currentConfig,
              [inputs.key]: (currentConfig[inputs.key] || []).concat([ inputs.productId ])
            });
        }
      }
      else {
        updatedConfig = await HomePageConfig.updateOne({ id: currentConfig.id })
          .set({
            ...currentConfig,
            [inputs.key]: null
          })
      }

      if (!updatedConfig) {
        throw exits.somethingWentWrong(errorMessages.somethingWentWrong);
      }

      this.res.json({ code: "success", data: updatedConfig });
    }

    console.log(inputs);

    return;

  }

};
