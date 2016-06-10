module.exports = {
	port: 8001,
    connections: {
		mongodbprod: {
			adapter: 'sails-mongo',
			host: 'localhost',
			port: 27017,
			user: process.env.MONGO_USER || "",
            password: process.env.MONGO_PASSWD || "",
			database: 'UnitPalProd'
		}
	},
	models: {
        connection: 'mongodbprod'
    },
    hookTimeout: 40000,
    log: {
        level: "silent"
    },
    unitPalConfig: {
        appContextRoot: "http://demo.3angletech.com:8001"
    }
};