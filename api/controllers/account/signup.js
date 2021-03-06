const constants = require('../../../config/constants');

const errorMessages = {
  success: 'Account created successfully.',
  invalid: 'Invalid Request',
  invalidUsername: 'Username must be alphanumeric with 3 to 50 characters',
  invalidEmail: 'Invalid Email ID',
  invalidMobile: 'Invalid Mobile Number',
  invalidPassword: 'Password must be more than six characters',
  emailOrMobileRequired: 'Email or Mobile number is required',
  accountAlreadyInUse: 'Email or Mobile number is already in use!',
  serverError: 'Internal Server Error. Please try again!',
};

module.exports = {

  friendlyName: 'Signup',

  description: 'Sign up for a new user account.',

  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,

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

    username:  {
      type: 'string',
      example: 'Frida Kahlo de Rivera',
      description: 'The user\'s full name.',
    },

    userType:  {
      type: 'string',
      example: 'DEFAULT, WHOLESALER, DRIVER',
    }
  },

  exits: {

    success: {
      statusCode: 200,
      responseType: 'success',
    },

    invalid: {
      statusCode: 400,
      responseType: 'badRequest',
    },

    invalidUsername: {
      statusCode: 400,
      responseType: 'validationError',
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

    accountAlreadyInUse: {
      statusCode: 409,
      responseType: 'conflict',
    },

    serverError: {
      statusCode: 500,
      responseType: 'serverError',
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

    const { username, userType, email, mobile, password } = inputs;
    let user = {};
    let uniqueUserCheckClause;

    validate('username', username, 'invalidUsername');
    user.username = username;

    if (!email && !mobile) {
      throw exits.emailOrMobileRequired(errorMessages.emailOrMobileRequired);
    }

    if (email) {
      validate('email', email, 'invalidEmail');
      user.email = email.toLowerCase();
      uniqueUserCheckClause = { email: user.email };
    }

    if (mobile) {
      validate('mobile', mobile, 'invalidMobile');
      user.mobile = mobile;
      uniqueUserCheckClause = { mobile };
    }

    validate('password', password, 'invalidPassword');
    user.password = password;

    // check if user exists
    const doesUserExist = await User.findOne().where(uniqueUserCheckClause);

    if (doesUserExist) {
      throw exits.accountAlreadyInUse(errorMessages.accountAlreadyInUse);
    }

    // set account status to be confirmed for DEFAULT users
    // set userType if non-DEFAULT
    if (!userType || userType === constants.USER_TYPES.DEFAULT) {
      user.accountStatus = constants.ACCOUNT_STATUS.CONFIRMED;
    }
    else {
      user.userType = userType;
    }

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create({
      ...user,
      tosAcceptedByIp: this.req.ip
    })
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;

    // send account activation mail (with OTP) to the current user
    if (!userType || userType === constants.USER_TYPES.DEFAULT) {
      // if email is provided then send welcome email
      if (email) {
        await sails.helpers.sendMail.with({
          to: email,
          subject: 'Welcome to E-Vendor',
          templateData: {
            username,
          },
          templateFile: 'welcomeEmail',
        });
      }

      // TODO: if mobile then send welcome message
      if (mobile) {

      }
    }

    exits.success();
  }

};
