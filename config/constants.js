var keyMirror = require('key-mirror');

const USER_TYPES = keyMirror({
	DEFAULT: null,
	WHOLESALER: null,
	DATES: null,
	RESTAURANT: null,
	DRIVER: null,
});

const ACCOUNT_STATUS = keyMirror({
	CONFIRMED: null,
	UNCONFIRMED: null,
	PASSWORD_RESET: null,
});

const OTP_PURPOSE = keyMirror({
	ACCOUNT_VERIFICATION: null,
	PASSWORD_RESET: null,
});

module.exports = {
	USER_TYPES,
	ACCOUNT_STATUS,
	OTP_PURPOSE
};
