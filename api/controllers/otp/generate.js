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

		otpPurpose: {
			type: 'string',
			description: 'ACCOUNT_VERIFICATION, PASSWORD_RESET etc',
		}
	},

	exits: {
		success: {
      statusCode: 200,
      responseType: 'success',
			description: 'OTP sent successfully.'
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

    OTPMaxRetries: {
      statusCode: 200,
      responseType: 'invalid',
      description: 'Maximum OTP retries reached. Please try again tomorrow.',
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

    const { email, mobile, otpPurpose } = inputs;

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

    validate('otpPurpose', otpPurpose, 'invalidRequest');

    // check if user exists
    const user = await User.findOne().where(uniqueUserCheckClause);

    if (!user) {
      throw 'notFound';
    }

    if (user.otpCountToday >= sails.config.custom.maxOTPCountPerDay) {
      throw 'OTPMaxRetries';
    }

    const lastOtpSentAt = user.lastOtpSentAt;
    let otpCountToday;

    if (sails.helpers.isToday(lastOtpSentAt)) {
      otpCountToday = (user.otpCountToday || 0) + 1;
    }
    else {
      otpCountToday = 1;
    }

    // send OTP to user
    const otp = sails.helpers.getOtpCode();

    // if email is provided then send OTP in email
    if (email) {
      await sails.helpers.sendMail.with({
        to: email,
        subject: 'Verify your account',
        templateData: {
          username: user.username,
          otp,
        },
        templateFile: 'verifyAccount',
      });
    }

    // TODO: if mobile then send OTP to mobile as SMS
    if (mobile) {

    }

    // save OTP in db
    const currentTimeStamp = (new Date()).getTime();
    const updatedUser = await User.updateOne(uniqueUserCheckClause)
      .set({
        otp,
        otpPurpose,
        otpExpiresAt: currentTimeStamp + sails.config.custom.otpExpiryTime,
        otpCountToday,
        lastOtpSentAt: currentTimeStamp,
        accountStatus: otpPurpose === constants.ACCOUNT_STATUS.PASSWORD_RESET
          ? otpPurpose
          : user.accountStatus
      });

    if (!updatedUser) {
      throw 'somethingWentWrong';
    }

    exits.success();
	}

};
