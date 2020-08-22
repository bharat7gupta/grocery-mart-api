const constants = require('../../../config/constants');

const errorMessages = {
  success: 'OTP Verified!',
  emailOrMobileRequired: 'Email or Mobile number is required',
  invalidEmail: 'Invalid Email ID',
  invalidMobile: 'Invalid Mobile Number',
  notFound: 'User not found.',
  invalidRequest: 'Invalid Request.',
  somethingWentWrong: 'Something went wrong. Please try again',
  OTPExpired: 'Your OTP has expired. Please get a new OTP',
  incorrectOTP: 'Entered OTP in incorrect.',
};

module.exports = {
  friendlyName: 'Validate OTP',

	description: 'Validate OTP. Purpose: ACCOUNT_VERIFICATION, PASSWORD_RESET etc',

	inputs: {
		email: {
			type: 'string',
			description: 'Email ID required if account created with Email ID'
    },

		mobile: {
			type: 'string',
			description: 'Mobile number required if account created with mobile number'
    },

    otp: {
			type: 'string',
			description: 'User entered OTP',
		},

		otpPurpose: {
			type: 'string',
			description: 'ACCOUNT_VERIFICATION, PASSWORD_RESET etc',
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

    invalidEmail: {
      statusCode: 400,
      responseType: 'validationError',
    },

    invalidMobile: {
      statusCode: 400,
      responseType: 'validationError',
    },

    notFound: {
			statusCode: 400,
			responseType: 'validationError',
    },

    invalidRequest: {
			statusCode: 400,
			responseType: 'validationError',
    },
    
    somethingWentWrong: {
      statusCode: 500,
			responseType: 'validationError',
    },

    OTPExpired: {
      statusCode: 200,
      responseType: 'expired',
    },

    incorrectOTP: {
      statusCode: 400,
			responseType: 'validationError',
    }
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

    let uniqueUserCheckClause;

    const { email, mobile, otp, otpPurpose } = inputs;

		if (!email && !mobile) {
      throw exits.emailOrMobileRequired(errorMessages.emailOrMobileRequired);
    }

    if (email) {
      validate('email', email, 'invalidEmail');
      uniqueUserCheckClause = { email: email.toLowerCase() };
    }

    if (mobile) {
      validate('mobile', mobile, 'invalidMobile');
      uniqueUserCheckClause = { mobile };
    }

    validate('otpPurpose', otpPurpose, 'invalidRequest');

    // check if user exists
    const user = await User.findOne().where(uniqueUserCheckClause);

    if (!user) {
      throw exits.notFound(errorMessages.notFound);
    }

    if (user.otpPurpose !== otpPurpose) {
      throw exits.invalidRequest(errorMessages.invalidRequest);
    }

    const currentTimeStamp = (new Date()).getTime();
    if (user.otpExpiresAt < currentTimeStamp) {
      throw exits.OTPExpired(errorMessages.OTPExpired);
    }

    if (user.otp !== otp) {
      throw exits.incorrectOTP(errorMessages.incorrectOTP);
    }

    // confirm account
    if (user.otpPurpose === constants.OTP_PURPOSE.ACCOUNT_VERIFICATION && 
      user.accountStatus === constants.ACCOUNT_STATUS.UNCONFIRMED
    ) {
      const updatedUser = await User.updateOne(uniqueUserCheckClause)
        .set({
          otp: '',
          otpPurpose: '',
          otpExpiresAt: 0,
          accountStatus: constants.ACCOUNT_STATUS.CONFIRMED
        });

      if (!updatedUser) {
        throw exits.somethingWentWrong(errorMessages.somethingWentWrong);
      }
    }
    else if (user.otpPurpose === constants.OTP_PURPOSE.PASSWORD_RESET &&
      user.accountStatus === constants.ACCOUNT_STATUS.PASSWORD_RESET
    ) {
      const currentTime = (new Date()).getTime();
      const passwordResetExpiry = currentTime + sails.config.custom.passwordResetExpiryTime;

      const updatedUser = await User.updateOne(uniqueUserCheckClause)
        .set({
          otp: '',
          otpPurpose: '',
          otpExpiresAt: 0,
          passwordResetExpiry,
        });

      if (!updatedUser) {
        throw exits.somethingWentWrong(errorMessages.somethingWentWrong);
      }
    }
    else {
      throw exits.invalidRequest(errorMessages.invalidRequest);
    }

    exits.success();
	}

};
