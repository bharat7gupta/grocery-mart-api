const jwt = require('jsonwebtoken');

const errorMessages = {
  pincodeRequired: 'Pincode is required.',
  invalidPincode: "Invalid pincode.",
  houseNoRequired: 'House No. is required.',
  roadNameRequired: 'Road name is required.',
  cityRequired: 'City is required.',
  nameRequired: "Delivery Receiver's name is required.",
  phoneNumberRequired: "Delivery Receiver's phone number is required.",
  invalidPhoneNumber: "Delivery Receiver's phone number is invalid.",
  invalidAddressId: "Invalid address id",
}

module.exports = {

  friendlyName: 'Save address',

  description: 'Save address.',

  inputs: {
    addressId: {
      type: 'string',
    },

    pincode: {
      type: 'string',
    },

    houseNo: {
      type: 'string',
    },

    roadName: {
      type: 'string',
    },

    city: {
      type: 'string',
    },

    landmark: {
      type: 'string',
    },

    name: {
      type: 'string',
    },

    phoneNumber: {
      type: 'string',
    },

    alternatePhoneNumber: {
      type: 'string',
    },
  },

  exits: {
    successWithData: {
      statusCode: 200,
      responseType: 'successWithData',
    },

    pincodeRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidPincode: {
      statusCode: 400,
      responseType: 'validationError',
    },

    houseNoRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    roadNameRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    cityRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    nameRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    phoneNumberRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidPhoneNumber: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidAddressId: {
      statusCode: 400,
      responseType: 'validationError',
    },
  },

  fn: async function (inputs, exits) {
    const {
      pincode,
      houseNo,
      roadName,
      city,
      landmark,
      name,
      phoneNumber,
      alternatePhoneNumber,
      addressId
    } = inputs;

    if (!pincode || pincode.trim() === "") {
      throw exits.pincodeRequired(errorMessages.pincodeRequired);
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      throw exits.invalidPincode(errorMessages.invalidPincode);
    }

    if (!houseNo || houseNo.trim() === "") {
      throw exits.houseNoRequired(errorMessages.houseNoRequired);
    }

    if (!roadName || roadName.trim() === "") {
      throw exits.roadNameRequired(errorMessages.roadNameRequired);
    }

    if (!city || city.trim() === "") {
      throw exits.cityRequired(errorMessages.cityRequired);
    }

    if (!name || name.trim() === "") {
      throw exits.nameRequired(errorMessages.nameRequired);
    }

    if (!phoneNumber || phoneNumber.trim() === "") {
      throw exits.phoneNumberRequired(errorMessages.phoneNumberRequired);
    }

    if (! /^\d{10}$/.test(phoneNumber)) {
      throw exits.invalidPhoneNumber(errorMessages.invalidPhoneNumber);
    }

    const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);
    let addressData;

    try {
      if (!addressId) {
        const addressId = '@' + Math.random().toString(36).substr(2, 7) + '@';

        addressData = await Address.create({
          addressId,
          userId: decodedData.id,
          pincode,
          houseNo,
          roadName,
          city,
          landmark,
          name,
          phoneNumber,
          alternatePhoneNumber,
        })
        .intercept({name: 'UsageError'}, 'invalid')
        .fetch();
      } else {
        const existingAddressData = await Address.findOne({ userId: decodedData.id, addressId });

        if (!existingAddressData) {
          throw exits.invalidAddressId(errorMessages.invalidAddressId);
        }

        addressData = await Address.updateOne({ userId: decodedData.id, addressId })
          .set({
            addressId,
            userId: decodedData.id,
            pincode: pincode || existingAddressData.pincode,
            houseNo: houseNo || existingAddressData.houseNo,
            roadName: roadName || existingAddressData.roadName,
            city: city || existingAddressData.city,
            landmark: landmark || existingAddressData.landmark,
            name: name || existingAddressData.name,
            phoneNumber: phoneNumber || existingAddressData.phoneNumber,
            alternatePhoneNumber: alternatePhoneNumber || existingAddressData.alternatePhoneNumber,
          });
      }

      const { id, createdAt, updatedAt, ...addressParams } = addressData;
      exits.successWithData(addressParams);
    } catch(e) {
      this.res.json({
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again!'
      });
    }
  }
};
