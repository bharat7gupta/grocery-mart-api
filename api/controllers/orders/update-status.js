const jwt = require('jsonwebtoken');

module.exports = {

	friendlyName: 'Update status',
  
	description: 'update order status',
  
	inputs: {
	  id: {
		type: 'string',
		required: true,
	  },
	  status: {
		type: 'string',
		required: true,
	  },
	  driverId: {
		type: 'string'
	  },
	  customerSignature: {
		  type: 'string',
	  },
	  comment: {
		  type: 'string',
	  }
	},
  
	exits: {
	  successWithData: {
		statusCode: 200,
		responseType: 'successWithData',
	  },
	  invalidRequest: {
		  statusCode: 401,
		  responseType: 'invalid'
	  }
	},

	fn: async function (inputs, exits) {
		try {
			const { id, status, driverId, customerSignature, comment } = inputs;
			const decodedData = jwt.verify(this.req.headers['token'], sails.config.custom.jwtKey);

			const userRecord = await User.findOne({
				id: decodedData.id,
				userType: decodedData.type,
			});

			if (!userRecord || ['admin', 'DRIVER'].indexOf(decodedData.type) <= -1) {
				exits.invalidRequest('Invalid user');
				return;
			}

			if (decodedData.type === 'admin' && ['CONFIRMED', 'REJECTED'].indexOf(status) <= -1) {
				exits.invalidRequest('Admin can only confirm or reject an order');
				return;
			}

			if (decodedData.type === 'DRIVER' && ['COMPLETED', 'CANCELLED'].indexOf(status) <= -1) {
				exits.invalidRequest('Driver can only complete or cancel an order');
				return;
			}

			if (decodedData.type === 'DRIVER' && status === 'COMPLETED' && !customerSignature) {
				exits.invalidRequest('Each completed delivery must have customers signature');
				return;
			}

			if (decodedData.type === 'DRIVER' && status === 'CANCELLED' && !comment) {
				exits.invalidRequest('Provide cancellation reason');
				return;
			}

			let updatedData = { status };
	
			if (driverId) {
				updatedData.driverId = driverId;
			}

			if (customerSignature) {
				updatedData.customerSignature = customerSignature;
			}

			if (comment) {
				updatedData.comment = comment;
			}

			const updatedOrder = await Order.updateOne({ id })
				.set(updatedData);

			if (updatedOrder) {
				exits.successWithData(updatedOrder);
			} else {
				exits.invalidRequest('Invalid Request');
			}
		} catch (e) {
			this.res.json({
				code: 'SERVER_ERROR',
				message: 'Something went wrong. Please try again!'
			});
		}
	}
};
