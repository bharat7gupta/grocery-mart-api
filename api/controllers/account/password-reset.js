const constants = require('../../../config/constants');

const errorMessages = {
  invalidPassword: 'Password must be more than six characters',
  emailOrMobileRequired: 'Email or Mobile number is required',
  invalidEmail: 'Invalid Email ID',
  invalidMobile: 'Invalid Mobile Number',
  notFound: 'User not found.',
  invalidRequest: 'Invalid Request.',
  somethingWentWrong: 'Something went wrong. Please try again',
  passwordResetWindowExpired: 'You took too long to reset your password. Please re-generate an OTP.',
};

module.exports = {

  friendlyName: 'Password Reset',

  description: 'Password Reset API',

  inputs: {
    email: {
      type: 'string',
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    mobile: {
      type: 'string',
      description: 'The phone number for the new account, e.g. 6234567890',
      extendedDescription: 'Must be a valid phone number.',
    },

    password: {
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },
  },

  exits: {
    success: {
      statusCode: 200,
      responseType: 'success',
    },

    invalidEmail: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidMobile: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidPassword: {
      statusCode: 400,
      responseType: 'validationError',
    },

    emailOrMobileRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    notFound: {
			statusCode: 400,
			responseType: 'validationError',
    },

    somethingWentWrong: {
      statusCode: 500,
			responseType: 'validationError',
    },

    passwordResetWindowExpired: {
      statusCode: 200,
      responseType: 'validationError',
    },
  },


  fn: async function (inputs, exits) {
    const validate = (field, value, exitType) => {
      try {
        if (!value || ! _.trim(_.isEmpty(value))) {
          throw exits[exitType](errorMessages[exitType]);
        }

        User.validate(field, value);
      }
      catch(e) {
        throw exits[exitType](errorMessages[exitType]);
      }
    };

    const { email, mobile, password } = inputs;

    if (!email && !mobile) {
      throw exits.emailOrMobileRequired(errorMessages.emailOrMobileRequired);
    }

    let uniqueUserCheckClause;

    if (email) {
      validate('email', email, 'invalidEmail');
      uniqueUserCheckClause = { email };
    }

    if (mobile) {
      validate('mobile', mobile, 'invalidMobile');
      uniqueUserCheckClause = { mobile };
    }

    validate('password', password, 'invalidPassword');

    const user = await User.findOne().where(uniqueUserCheckClause);

    if (!user) {
      throw exits.notFound(errorMessages.notFound);
    }

    const currentTime = (new Date()).getTime();
    if (user.passwordResetExpiry < currentTime) {
      // password reset window expired
      throw exits.passwordResetWindowExpired(errorMessages.passwordResetWindowExpired);
    }

    const updatedUser = await User.updateOne(uniqueUserCheckClause)
      .set({
        password,
        passwordResetExpiry: 0,
        accountStatus: constants.ACCOUNT_STATUS.CONFIRMED
      });

    if (!updatedUser) {
      throw exits.somethingWentWrong(errorMessages.somethingWentWrong);
    }

    exits.success();

  }

};
