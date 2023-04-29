module.exports = {
	friendlyName: 'Transform user data',

	inputs: {
		user: {
			type: 'json'
		}
	},

	sync: true,

	fn: function(inputs) {
		const { user } = inputs;

		if (user) {
			const { id, email, mobile, username, userType, accountStatus, altPhoneNumber, landmark, licenseNumber, route, createdAt, updatedAt } = user;
			return { id, email, mobile, username, userType, accountStatus, altPhoneNumber, landmark, licenseNumber, route, createdAt, updatedAt };
		}

		return user;
	}
};
