module.exports = {
    port: 8001,
    connections: {
        mongodbtest: {
            adapter: 'sails-mongo',
            host: 'demo.3angletech.com',
            port: 27017,
            user: 'demothangle',
            password: 'Anisdy$57m!',
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
        emailService: {
            type: "mock"
        },
        imageUploadService: {
            type: "mock"
        }
    }
};