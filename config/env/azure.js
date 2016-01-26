module.exports = {
    port: process.env.PORT || 1337,
    models: {
        connection: 'mongodbazure'
    },
    hookTimeout: 40000,
    log: {
        level: "silent"
    },
	paths : {
		public: __dirname+'/../assets'
	}
};
