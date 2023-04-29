module.exports = async function success(errorMessage) {
	const errorCode = this.res.get('X-Exit');

	return this.res.json({
		code: errorCode,
		message: errorMessage
	});
};
