module.exports = {

	friendlyName: 'Get customers',
  
	description: 'Get customers.',
  
	inputs: {
  
	},
  
	exits: {
	  successWithData: {
		statusCode: 200,
		responseType: 'successWithData',
	  },
	},
  
	fn: async function (inputs, exits) {
	  try {
		const validCustomerTypes = ['DRIVER'];
		const users = await User.find({ isAdmin: false, userType: validCustomerTypes }).sort('createdAt DESC');
  
		const mappedUsers = users.map(user => sails.helpers.transformUser(user));
  
		exits.successWithData(mappedUsers);
	  } catch(e) {
		this.res.json({
		  code: 'SERVER_ERROR',
		  message: 'Something went wrong. Please try again!'
		});
	  }
	}
  };
  