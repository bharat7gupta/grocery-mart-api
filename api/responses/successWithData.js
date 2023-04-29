module.exports = async function successWithData(data) {
	return this.res.json({
		code: 'success',
		data: data
	});
};
