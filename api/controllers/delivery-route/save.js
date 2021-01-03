module.exports = {

  friendlyName: 'Save',

  description: 'Save delivery route.',

  inputs: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
      example: 'From some place to another place',
    },

    points: {
      type: 'json',
      example: ['First point', 'Second point', 'Third point', 'Fourth point'],
    }
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },
  },

  fn: async function (inputs, exits) {
    const { id, name, points } = inputs;
    let deliveryRouteData;

    try {
      if (!id) {
        deliveryRouteData = await DeliveryRoute.create({ name, points })
          .intercept({name: 'UsageError'}, 'invalid')
          .fetch();
      } else {
        deliveryRouteData = await DeliveryRoute.updateOne({ id })
          .set({ name, points });
      }

      const { createdAt, updatedAt, ...deliveryRouteParams } = deliveryRouteData;
      exits.successWithData(deliveryRouteParams);
    } catch (e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }
};
