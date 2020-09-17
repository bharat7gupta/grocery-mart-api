const constants = require('../../../config/constants');

const errorMessages = {
  success: 'Logged in successfully!',
  emailOrMobileRequired: 'Email or Mobile number is required',
  badEmailPasswordCombo: 'The provided email and password combination does not match any user in the database.',
  badMobilePasswordCombo: 'The provided email and password combination does not match any user in the database.',
  accountNotConfirmed: 'Please confirm your account and then try logging in.',
};

module.exports = {

  friendlyName: 'Login',

  description: 'Log in using the provided email and password combination.',

  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    email: {
      type: 'string',
      description: 'The email address associated with account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    mobile: {
      type: 'string',
      description: 'The phone number associated with account, e.g. 6234567890',
      extendedDescription: 'Must be a valid phone number.',
    },

    password: {
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".'
    },

    isAdmin: {
      type: 'boolean',
    }

  },

  exits: {

    success: {
      statusCode: 200,
      responseType: 'success',
    },

    emailOrMobileRequired: {
      statusCode: 400,
      responseType: 'validationError',
    },

    badEmailPasswordCombo: {
      statusCode: 403,
      responseType: 'unauthorized'
    },

    badMobilePasswordCombo: {
      statusCode: 403,
      responseType: 'unauthorized'
    },

    accountNotConfirmed: {
      statusCode: 403,
      responseType: 'unauthorized'
    }

  },


  fn: async function (inputs, exits) {

    const { email, mobile, password, isAdmin } = inputs;

    if (!email && !mobile) {
      throw exits.emailOrMobileRequired(errorMessages.emailOrMobileRequired);
    }

    // Look up by the email address.
    let userRecord;
    const userFindClause = email ? { email: email.toLowerCase() } : { mobile };
    const userRecords = await User.find(userFindClause);

    if (isAdmin) {
      userRecord = userRecords.find(u => u.isAdmin && isAdmin === u.isAdmin);
    }
    else {
      userRecord = userRecords.find(u => !u.isAdmin);
    }

    if (userRecord && userRecord.accountStatus === constants.ACCOUNT_STATUS.UNCONFIRMED) {
      throw exits.accountNotConfirmed(errorMessages.accountNotConfirmed);
    }

    // If no user record or the password doesn't match, then exit thru badCombo.
    if (!userRecord || password !== userRecord.password) {
      if (email) {
        throw exits.badEmailPasswordCombo(errorMessages.badEmailPasswordCombo);
      }
      else {
        throw exits.badMobilePasswordCombo(errorMessages.badMobilePasswordCombo);
      }
    }

    // Modify the active session instance.
    // (This will be persisted when the response is sent.)
    this.req.session.userId = userRecord.id;
    this.req.session.userName = userRecord.username;
    this.req.session.userType = userRecord.userType;

    this.res.json({
      code: 'success',
      data: { username: userRecord.username }
    });

  }

};
