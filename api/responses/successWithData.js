module.exports = async function successWithData(data) {
	// const errorCode = this.res.get('X-Exit');

	return this.res.json({
		code: 'success',
		data: data
	});
};
