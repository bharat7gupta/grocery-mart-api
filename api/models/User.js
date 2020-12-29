/**
 * User.js
 *
 * A user who can log in to this application.
 */

var constants = require('../../config/constants');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    email: {
      type: 'string',
      isEmail: true,
      maxLength: 200,
      example: 'mary.sue@example.com'
    },

    mobile: {
      type: 'string',
      regex: /^\d{10}$/,
      example: '6123456789'
    },

    password: {
      type: 'string',
      required: true,
      regex: /^\w{6,}$/,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    isAdmin: {
      type: 'boolean',
      defaultsTo: false
    },

    username: {
      type: 'string',
      required: true,
      regex: /^[a-zA-Z0-9\s]{3,}$/,
      description: 'Full representation of the user\'s name.',
      maxLength: 50,
      example: 'Mary Sue van der McHenst'
    },

    userType: {
      type: 'string',
      isIn: Object.keys(constants.USER_TYPES),
      defaultsTo: constants.USER_TYPES.DEFAULT,
      description: `Type of the user. Can be either of DEFAULT (General buyer),
        WHOLESALER or DRIVER (person making goods delivery)`,
      example: 'WHOLESALER'
    },

    accountStatus: {
      type: 'string',
      isIn: Object.keys(constants.ACCOUNT_STATUS),
      defaultsTo: constants.ACCOUNT_STATUS.UNCONFIRMED,
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription:
`Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the account verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "change-requested"
email status until they click the link in the confirmation email.`
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },

    otp: {
      type: 'string',
      description: 'OTP sent to the user',
      example: '242455'
    },

    otpPurpose: {
      type: 'string',
      isIn: Object.keys(constants.OTP_PURPOSE),
      description: 'Purpose for OTP. ACCOUNT_VERIFICATION, PASSWORD_RESET etc',
    },

    otpExpiresAt: {
      type: 'number',
      description: 'Timestamp at which OTP expires',
      example: 1502844074211
    },

    otpCountToday: {
      type: 'number',
      description: 'Total OTP sent in the current day',
    },

    lastOtpSentAt: {
      type: 'number',
      description: 'Timestamp of when an OTP was last sent to user. Max of MAX_OTP_COUNT_PER_DAY. OTP wont be sent after that',
      example: 1502844074211,
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    passwordResetExpiry: {
      type: 'number',
      description: 'When password reset is initiated then we set a time limit within which the user must reset his password',
      example: 1502844074211
    },

    altPhoneNumber: {
      type: 'string',
    },

    landmark: {
      type: 'string',
    },

    licenseNumber: {
      type: 'string',
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a

  },

};
