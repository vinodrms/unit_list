module.exports = {
    port: 8888,
    connections: {
        mongodbtest: {
            adapter: 'sails-mongo',
            host: 'localhost',
            port: 27017,
            user: process.env.MONGO_USER || "",
            password: process.env.MONGO_PASSWD || "",
            database: 'UnitPalTest'
        }
    },
    models: {
        connection: 'mongodbtest'
    },
    hookTimeout: 40000,
    log: {
        level: "silent"
    },
    unitPalConfig: {
        defaultClientSessionEnabled: true,
        emailService: {
            type: "mock"
        },
        imageUploadService: {
            type: "mock"
        },
        pdfReportsService: {
            type: "mock"
        },
        loggerChannels: [
        
        ]
    }
};