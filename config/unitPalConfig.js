module.exports.unitPalConfig = {
	databaseType: "mongodb",
	emailService: {
		type: "smtp",
		settings: {
			user: "unitpalapp@gmail.com",
			password: "TestTest,01",
			tls: { ciphers: "SSLv3" },
			host: "smtp.gmail.com"
		}
	},
	appContextRoot: "http://127.0.0.1:8001"
};