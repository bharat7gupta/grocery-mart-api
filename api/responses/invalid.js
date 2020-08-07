module.exports = async function invalid() {
	const errorCode = this.res.get('X-Exit');
	const errorMessage = this.res.get('X-Exit-Description');

	return this.res.json({
		code: errorCode,
		message: errorMessage
	});
};
