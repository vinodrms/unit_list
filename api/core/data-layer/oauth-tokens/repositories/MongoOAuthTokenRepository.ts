import { IOAuthTokenRepository } from "../IOAuthTokenRepository";
import { OAuthTokenDO } from "../data-objects/OAuthTokenDO";
import { MongoRepository } from "../../common/base/MongoRepository";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";

import _ = require('underscore');

declare var sails: any;

export class MongoOAuthTokenRepository extends MongoRepository implements IOAuthTokenRepository {
    logAndReject(arg0: any, arg1: any, arg2: any, arg3: any): any {
        throw new Error("Method not implemented.");
    }

    constructor() {
        let oAuthTokensEntity = sails.models.oauthtokensentity;
        super(oAuthTokensEntity);
    }

    public getOAuthTokenByAccessToken(accessToken: string): Promise<OAuthTokenDO> {
        return new Promise<OAuthTokenDO>((resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) => {
            this.getOAuthTokenByAccessTokenCore(resolve, reject, accessToken);
        });
    }

    private getOAuthTokenByAccessTokenCore(resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void },
        accessToken: string) {

        this.findOneDocument({ "accessToken": accessToken },
            () => {
                var thError = new ThError(ThStatusCode.OAuthTokenRepositoryOAuthTokenNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Token not found", 
                    { accessToken: accessToken }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.OAuthTokenRepositoryErrorGettingOAuthToken, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting OAuthToken", 
                    { accessToken: accessToken }, thError);
                reject(thError);
            },
            (foundOAuthToken: Object) => {
                var oAuthToken: OAuthTokenDO = new OAuthTokenDO();
                oAuthToken.buildFromObject(foundOAuthToken);
                resolve(oAuthToken);
            }
        );
    }

    public createOAuthTokenToken(oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO> {
        return new Promise<OAuthTokenDO>((resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) => {
            this.createOAuthTokenTokenCore(resolve, reject, oAuthToken);
        });
    }

    private createOAuthTokenTokenCore(resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }, 
        oAuthToken: OAuthTokenDO) {
        
        oAuthToken.versionId = 0;
        
        this.createDocument(oAuthToken,
            (err: Error) => {
                this.logAndReject(err, reject, { oAuthToken: oAuthToken }, ThStatusCode.BedRepositoryErrorAddingBed);
            },
            (createdOAuthToken: Object) => {
                var oAuthToken: OAuthTokenDO = new OAuthTokenDO();
                oAuthToken.buildFromObject(createdOAuthToken);
                resolve(oAuthToken);
            }
        );
    }
}