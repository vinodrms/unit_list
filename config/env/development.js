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
    }
};