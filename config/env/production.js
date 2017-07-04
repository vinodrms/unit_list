module.exports = {
    port: 8001,
    connections: {
        mongodbprod: {
            adapter: 'sails-mongo',
            host: 'localhost',
            port: 27017,
            user: process.env.MONGO_USER || "",
            password: process.env.MONGO_PASSWD || "",
            database: 'UnitPalProd_v2'
        }
    },
    models: {
        connection: 'mongodbprod'
    },
    hookTimeout: 40000,
    bootstrapTimeout: 400000,
    log: {
        level: "silent"
    },
    unitPalConfig: {
        appContextRoot: "http://demo.3angletech.com:8001",
        googleAnalytics: {
            enabled: true,
            trackingId: "UA-67731917-6"
        },
        loggerChannels: [
            {
                type: "papertrail",
                options: {
                    host: 'logs5.papertrailapp.com',
                    port: 13086,
                    level: "debug"
                }
            },
        ]
    },

};
