const oauthserver = require('oauth2-server');

declare var sails: any;

export class OAuthServerInitializer {
    public register() {
        // saving globally the oauthserver server instance 
        oauthserver({
            model: {
                getAccessToken: (accessToken: string) => {

                },
                getRefreshToken: (refreshToken: string) => {

                },
                getClient: (clientId, clientSecret) => {

                },
                getUser: (username, password) => {

                },
                saveToken: (token, client, user) => {
                
                },
                revokeToken: (token) => {

                },
                verifyScope: (accessToken, scope) => {

                }
            },
            grants: ['password', 'refresh_token'],
            debug: true
        });

        sails.config.oauthserver = oauthserver;
    }
}