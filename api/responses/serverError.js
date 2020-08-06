module.exports = async function serverError() {
	const errorCode = 'SERVER_ERROR';
	const errorMessage = 'Internal Server Error. Please try again!';

	return this.res.json({
		code: errorCode,
		message: errorMessage
	});
};
