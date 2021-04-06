const jwt = require('jsonwebtoken');
var constants = require('../../../config/constants');

const errorMessages = {
  serverError: 'Internal Server Error. Please try again!',
  invalidRequest: 'Invalid request',
  invalidLocationId: 'Invalid Location Id'
};

module.exports = {

  friendlyName: 'Salesman Update status',

  description: 'Salesman Update status',

  inputs: {
    salesmanId: {
      type: 'string',
    },
    status: {
      type: 'string',
    },
    locationId: {
      type: 'string'
    },
  },

  exits: {
    serverError: {
      statusCode: 500,
      responseType: 'serverError',
    },

    invalidRequest: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidLocationId: {
      statusCode: 400,
      responseType: 'validationError',
    }
  },

  fn: async function (inputs, exits) {
    const { salesmanId, status, locationId } = inputs;
    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

    if (!locationId || !status || decodedData.type !== 'admin') {
      exits.invalidRequest(errorMessages.invalidRequest);
      return;
    }

    let updatedData = { status };

    try {
      if (status === constants.SHOP_STATUS.CONFIRMED) {
        if (!locationId) {
          exits.invalidLocationId(errorMessages.invalidLocationId);
          return;
        }

        const location = await Location.findOne({ id: locationId });

        if (!location) {
          exits.invalidLocationId(errorMessages.invalidLocationId);
          return;
        } else {
          updatedData.locationIds = [ location.id ];
        }
      }

      const updatedUserDetails = await User.updateOne({
        id: salesmanId,
        userType: constants.USER_TYPES.SALESMAN
      }).set(updatedData);

      if (updatedUserDetails) {
        const { id, email, mobile, userType, accountStatus, altPhoneNumber, locationIds, createdAt, updatedAt } = updatedUserDetails;

        this.res.json({
          code: 'success',
          data: { id, email, mobile, userType, accountStatus, altPhoneNumber, locationIds, createdAt, updatedAt }
        });
      } else {
        exits.invalidRequest(errorMessages.invalidRequest);
      }
    } catch (e) {
      exits.serverError(errorMessages.serverError);
    }
  }

};
