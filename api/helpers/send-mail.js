const mailgun = require('mailgun-js');
const ejs = require('ejs');
const path = require('path');

module.exports = { 
	inputs: {
		to: {
			type: 'string',
		},

		subject: {
			type: 'string',
		},

		templateFile: {
			type: 'string',
		},

		templateData: {
			type: 'json'
		},
	},

	fn: async function(inputs) {
		const mailer = mailgun({
			apiKey: sails.config.custom.mailgunApiKey,
			domain: sails.config.custom.mailgunDomain,
		});

		const { subject, to, templateFile, templateData } = inputs;
		const templateFilePath = path.resolve(
			sails.config.appPath,
			`api/emailTemplates/${templateFile}.ejs`
		);

		ejs.renderFile(templateFilePath, templateData, null, (err, html) => {
			var mailOptions = {
				from: sails.config.custom.mailFrom,
				to,
				subject,
				html,
			};
	
			mailer.messages().send(mailOptions, (error) => {
				if (error) {
					console.log(`Email could not be sent to: ${inputs.to}.`, error);
				}
				else {
					console.log('Email sent!');
				}
			});
		});
	}
};
