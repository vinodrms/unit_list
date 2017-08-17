import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { ReportGenerator } from '../core/domain-layer/reports/ReportGenerator';
import { ReportFileResult } from '../core/domain-layer/reports/common/result/ReportFileResult';

const OAuth2Server = require('oauth2-server');
const OAuth2Request = OAuth2Server.Request;
const OAuth2Response = OAuth2Server.Response;

declare var sails: any;

export class OAuthTokenController extends BaseController {
    public getToken(req: any, res: any) {
        let options = {
            // ...
            // Allow token requests using the password grant to not include a client_secret.
            requireClientAuthentication: {
                password: false,
                refresh_token: false
            }
        };
        debugger

        sails.config.oauthserver.token(new OAuth2Request(req), new OAuth2Response(res), options)
            .then((token) => {
                debugger
                this.returnSuccesfulResponse(req, res, { token: token });
            }).catch((err: any) => {
                debugger
                this.returnErrorResponse(req, res, err, 5);
            });
    }
}

let oAuthTokenControllerInstance = new OAuthTokenController();
module.exports = {
    getToken: oAuthTokenControllerInstance.getToken.bind(oAuthTokenControllerInstance),
}