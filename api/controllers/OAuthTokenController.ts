import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { ReportGenerator } from '../core/domain-layer/reports/ReportGenerator';
import { ReportFileResult } from '../core/domain-layer/reports/common/result/ReportFileResult';
import { AccessTokenLifetime, RefreshTokenLifetime } from "../core/bootstrap/oauth/OAuthServerInitializer";
import { TokenDO } from "../core/domain-layer/oauth-tokens/TokenDO";
import { TokenType } from "../core/domain-layer/oauth-tokens/TokenType";

const OAuth2Server = require('oauth2-server');
const OAuth2Request = OAuth2Server.Request;
const OAuth2Response = OAuth2Server.Response;

declare var sails: any;

export class OAuthTokenController extends BaseController {
    public getToken(req: any, res: any) {
        let options = {
            // Allow token requests using the password or refresh_token grant to not include a client_secret.
            requireClientAuthentication: {
                password: false,
                refresh_token: false,
                accessTokenLifetime: AccessTokenLifetime,
                refreshTokenLifetime: RefreshTokenLifetime
            }

        };

        sails.config.oauthserver.token(new OAuth2Request(req), new OAuth2Response(res), options)
            .then((token) => {
                let tokenResponse = new TokenDO();
                tokenResponse.buildFromToken(token, TokenType.Bearer, AccessTokenLifetime);

                this.returnSuccesfulResponse(req, res, tokenResponse);
            }).catch((err: any) => {
                this.returnHttpErrorResponse(req, res, err.code, err.name);
            });
    }
}

let oAuthTokenControllerInstance = new OAuthTokenController();
module.exports = {
    getToken: oAuthTokenControllerInstance.getToken.bind(oAuthTokenControllerInstance),
}