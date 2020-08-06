var keyMirror = require('key-mirror');

const USER_TYPES = keyMirror({
	DEFAULT: null,
	WHOLESALER: null,
	DRIVER: null,
});

const ACCOUNT_STATUS = keyMirror({
	CONFIRMED: null,
	UNCONFIRMED: null,
	SUSPENDED: null,
});

module.exports = {
	USER_TYPES,
	ACCOUNT_STATUS,
};
