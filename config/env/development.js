module.exports = {
	port: 8001,
	connections: {
		mongodbdev: {
			adapter: 'sails-mongo',
			host: 'localhost',
			port: 27017,
			user: process.env.MONGO_USER || "",
            password: process.env.MONGO_PASSWD || "",
			database: 'UnitPalDev'
		}
	},
    models: {
        connection: 'mongodbdev'
    },
};