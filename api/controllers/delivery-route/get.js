module.exports = {
  friendlyName: 'Get saved routes for a particular user',

  description: 'Get saved routes for a particular user',

  inputs: {

  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
	  },
  },

  fn: async function (inputs, exits) {
    const routes = await DeliveryRoute.find().sort('updatedAt DESC');
    const mappedroutes = routes.map(route => {
      const { createdAt, updatedAt, ...routeParams } = route;
      return routeParams;
    });

    exits.successWithData(mappedroutes);
  }
};
