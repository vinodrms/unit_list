module.exports = {
	port: 8001,
	connections: {
		mongodbdev: {
			adapter: 'sails-mongo',
			host: 'localhost',
			port: 27017,
			user: '',
			password: '',
			database: 'UnitPalDev'
		}
	},
    models: {
        connection: 'mongodbdev'
    },
    unitPalConfig: {
        emailService: {
			type: "sendgrid",
			settings: {
                apiKey: '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',
                from: 'contact@unitpal.com'
            }
		}
	}
};