var keyMirror = require('key-mirror');

const USER_TYPES = keyMirror({
	DEFAULT: null,
	WHOLESALER: null,
	DATES: null,
	RESTAURANT: null,
	DRIVER: null,
	SALESMAN: null
});

const ACCOUNT_STATUS = keyMirror({
	CONFIRMED: null,
	UNCONFIRMED: null,
	BLOCKED: null,
	PASSWORD_RESET: null,
});

const OTP_PURPOSE = keyMirror({
	ACCOUNT_VERIFICATION: null,
	PASSWORD_RESET: null,
});

const SHOP_STATUS = keyMirror({
	CONFIRMED: null,
	UNCONFIRMED: null,
	BLOCKED: null,
})

module.exports = {
	USER_TYPES,
	ACCOUNT_STATUS,
	OTP_PURPOSE,
	SHOP_STATUS
};
