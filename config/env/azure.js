module.exports = {
    port: process.env.PORT || 1337,
	connections: {
		mongodbazure: {
			adapter: 'sails-mongo',
			host: process.env.MONGO_HOST,
			port: process.env.MONGO_PORT,
			user: process.env.MONGO_USER,
			password: process.env.MONGO_PASSWD,
			database: process.env.MONGO_DB
		}
	},
    models: {
        connection: 'mongodbazure'
    },
    hookTimeout: 40000,
    log: {
        level: "silent"
    },
	unitPalConfig: {
		appContextRoot: process.env.APP_CONTEXT_ROOT
	}
};