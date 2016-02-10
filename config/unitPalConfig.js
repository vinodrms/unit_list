module.exports.unitPalConfig = {
    databaseType: "mongodb",
    emailService: {
        type: "sendgrid",
        settings: {
            apiKey: "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",
            from: "contact@unitpal.com"
        }
    },
    imageUploadService: {
        type: "cloudinary",
        settings: {
            cloud_name: 'hbpr8ossz',
            api_key: '849423217949946',
            api_secret: 'V5Cr6imHfTPXitvr0bKtxcum3EA'
        }
    },
    appContextRoot: "http://127.0.0.1:8001"
};