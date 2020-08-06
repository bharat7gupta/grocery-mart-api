var keyMirror = require('key-mirror');

const USER_TYPES = keyMirror({
	DEFAULT: null,
	WHOLESALER: null,
	DRIVER: null,
});

const ACCOUNT_TYPES = keyMirror({
	CONFIRMED: null,
	UNCONFIRMED: null,
	SUSPENDED: null,
});

module.exports = {
	USER_TYPES,
	ACCOUNT_TYPES,
};
