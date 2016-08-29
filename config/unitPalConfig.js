module.exports.unitPalConfig = {
    databaseType: "mongodb",
    emailService: {
        type: "sendgrid",
        settings: {
            apiKey: "SG.GSlmdxA7Qk6SA8TEWkNSaA.7a5vmeljhV_T-BoMm_hhZOTdbt_AerUVoJoamAbZaRM",
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