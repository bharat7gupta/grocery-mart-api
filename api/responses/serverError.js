module.exports = async function serverError(errorMessage) {
	const errorCode = 'SERVER_ERROR';

	return this.res.json({
		code: errorCode,
		message: errorMessage
	});
};
