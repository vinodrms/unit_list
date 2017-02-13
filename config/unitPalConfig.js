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
    pdfReportsService: {
        type: "real",
    },
    slack: {
        "webhookUri": "https://hooks.slack.com/services/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",
        "channel": "#unitpal-audit",
        "username": "UnitPal",
        "enabled": false
    },
    googleAnalytics: {
        enabled: false,
        trackingId: ""
    },
    appContextRoot: "http://127.0.0.1:8001"
};