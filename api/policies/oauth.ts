const OAuth2Server = require('oauth2-server');
const OAuth2Request = OAuth2Server.Request;
const OAuth2Response = OAuth2Server.Response;

declare var sails: any;

module.exports = function (req: any, res: any, next: any) {
    sails.config.oauthserver.authenticate(new OAuth2Request(req), new OAuth2Response(res))
        .then((token) => {
            // The request was successfully authenticated.
            debugger
            return next();
        })
        .catch((err) => {
            // The request failed authentication.
            return res.forbidden('You are not permitted to perform this action.');
        });

};