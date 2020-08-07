const constants = require('../../../config/constants');

module.exports = {
  friendlyName: 'Generate OTP',

	description: 'Generate OTP for validation. Purpose: ACCOUNT_VERIFICATION, PASSWORD_RESET etc',

	inputs: {
		email: {
			type: 'string',
			description: 'Email ID required if account created with Email ID'
    },

		mobile: {
			type: 'string',
			description: 'Mobile number required if account created with mobile number'
    },

    password: {
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
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
			description: 'Account created successfully.'
		},

		emailOrMobileRequired: {
			statusCode: 400,
			responseType: 'validationError',
			description: 'Email or Mobile number is required',
    },

    invalidEmail: {
      statusCode: 400,
      responseType: 'validationError',
      description: 'Invalid Email ID',
    },

    invalidMobile: {
      statusCode: 400,
      responseType: 'validationError',
      description: 'Invalid Mobile Number',
    },

    invalidPassword: {
      statusCode: 400,
      responseType: 'validationError',
      description: 'Password must be more than six characters',
    },

    notFound: {
			statusCode: 400,
			responseType: 'validationError',
			description: 'User not found.',
    },

    invalidRequest: {
			statusCode: 400,
			responseType: 'validationError',
			description: 'Invalid Request.',
    },
    
    somethingWentWrong: {
      statusCode: 500,
			responseType: 'validationError',
			description: 'Something went wrong. Please try again',
    },

    OTPExpired: {
      statusCode: 200,
      responseType: 'expired',
      description: 'Your OTP has expired. Please get a new OTP',
    },

    incorrectOTP: {
      statusCode: 400,
			responseType: 'validationError',
			description: 'Entered OTP in incorrect.',
    }
	},

	fn: async function (inputs, exits) {
    const validate = (field, value, exitType) => {
      try {
        if (!value || ! _.trim(_.isEmpty(value))) {
          throw exitType;
        }

        User.validate(field, value);
      }
      catch(e) {
        throw exitType;
      }
    };

    let uniqueUserCheckClause;

    const { email, mobile, password, otp, otpPurpose } = inputs;

		if (!email && !mobile) {
			throw 'emailOrMobileRequired';
    }

    if (email) {
      validate('email', email, 'invalidEmail');
      uniqueUserCheckClause = { email: email.toLowerCase() };
    }

    if (mobile) {
      validate('mobile', mobile, 'invalidMobile');
      uniqueUserCheckClause = { mobile };
    }

    validate('password', password, 'invalidPassword');
    validate('otpPurpose', otpPurpose, 'invalidRequest');

    // check if user exists
    const user = await User.findOne().where(uniqueUserCheckClause);

    if (!user) {
      throw 'notFound';
    }

    if (user.otpPurpose !== otpPurpose) {
      throw 'invalidRequest';
    }

    const currentTimeStamp = (new Date()).getTime();
    if (user.otpExpiresAt < currentTimeStamp) {
      throw 'OTPExpired';
    }

    if (user.otp !== otp) {
      throw 'incorrectOTP';
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
        throw 'somethingWentWrong';
      }
    }
    else if (user.otpPurpose === constants.OTP_PURPOSE.PASSWORD_RESET &&
      user.accountStatus === constants.ACCOUNT_STATUS.PASSWORD_RESET
    ) {
      const updatedUser = await User.updateOne(uniqueUserCheckClause)
        .set({
          otp: '',
          otpPurpose: '',
          otpExpiresAt: 0,
          accountStatus: constants.ACCOUNT_STATUS.CONFIRMED
        });

      if (!updatedUser) {
        throw 'somethingWentWrong';
      }
    }
    else {
      throw 'invalidRequest';
    }

    exits.success({
      code: 'SUCCESS',
      message: 'OTP Verified!'
    });
	}

};
