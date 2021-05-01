/**
 * Shop.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

var constants = require('../../config/constants');

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    phoneNumber: {
      type: 'string',
      required: true,
    },
    address: {
      type: 'string',
      required: true,
    },
    imageUrl: {
      type: 'string',
      required: true,
    },
    gpsLat: {
      type: 'number',
      required: true,
    },
    gpsLong: {
      type: 'number',
      required: true,
    },
    createdBy: {
      type: 'string',
    },
    locationId: {
      type: 'string',
    },
    position: {
      type: 'number',
    },
    status: {
      type: 'string',
      isIn: Object.keys(constants.SHOP_STATUS),
    }
  },

};
