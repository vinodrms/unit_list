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
		appContextRoot: process.env.APP_CONTEXT_ROOT,
		emailService: {
			type: "sendgrid",
			settings: {
				apiKey: process.env.SENDGRID_API_KEY,
				from: process.env.SENDGRID_FROM
			}
		},
		imageUploadService: {
			type: "cloudinary",
			settings: {
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET
			}
		}
	}
};