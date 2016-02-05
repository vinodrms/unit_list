module.exports = {
    port: 8001,
    models: {
        connection: 'mongodbtest'
    },
    hookTimeout: 40000,
    log: {
        level: "silent"
    },
	unitPalConfig: {
		emailService: {
			type: "mock",
			settings: {}
		}
	}
};