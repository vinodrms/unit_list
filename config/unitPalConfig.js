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
	}
};