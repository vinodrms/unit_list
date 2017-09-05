import { IOAuthTokenRepository, OAuthTokenSearchCriteria } from "../IOAuthTokenRepository";
import { OAuthTokenDO } from "../data-objects/OAuthTokenDO";
import { MongoRepository } from "../../common/base/MongoRepository";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";
import { MongoQueryBuilder } from "../../common/base/MongoQueryBuilder";

import _ = require('underscore');

declare var sails: any;

export class MongoOAuthTokenRepository extends MongoRepository implements IOAuthTokenRepository {
    constructor() {
        super(sails.models.oauthtokensentity);
    }

    public getOAuthToken(searchCriteria: OAuthTokenSearchCriteria): Promise<OAuthTokenDO> {
        return new Promise<OAuthTokenDO>((resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) => {
            this.getOAuthTokenCore(resolve, reject, searchCriteria);
        });
    }

    private getOAuthTokenCore(resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void },
        searchCriteria: OAuthTokenSearchCriteria) {

        this.findOneDocument(this.buildSearchCriteria(searchCriteria),
            () => {
                var thError = new ThError(ThStatusCode.OAuthTokenRepositoryOAuthTokenNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Token not found",
                    { searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.OAuthTokenRepositoryErrorGettingOAuthToken, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting OAuthToken",
                    { searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundOAuthToken: Object) => {
                var oAuthToken: OAuthTokenDO = new OAuthTokenDO();
                oAuthToken.buildFromObject(foundOAuthToken);
                resolve(oAuthToken);
            }
        );
    }

    public addOAuthToken(oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO> {
        return new Promise<OAuthTokenDO>((resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) => {
            this.addOAuthTokenTokenCore(resolve, reject, oAuthToken);
        });
    }

    private addOAuthTokenTokenCore(resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void },
        oAuthToken: OAuthTokenDO) {

        oAuthToken.versionId = 0;

        this.createDocument(oAuthToken,
            (err: Error) => {
                this.logAndReject(err, reject, { oAuthToken: oAuthToken }, ThStatusCode.OAuthTokenRepositoryErrorSavingToken);
            },
            (createdOAuthToken: Object) => {
                var oAuthToken: OAuthTokenDO = new OAuthTokenDO();
                oAuthToken.buildFromObject(createdOAuthToken);
                resolve(oAuthToken);
            }
        );
    }

    public updateOAuthToken(searchCriteria: OAuthTokenSearchCriteria, oAuthToken: OAuthTokenDO): Promise<OAuthTokenDO> {
        return this.findAndModifyOAuthToken(searchCriteria, oAuthToken);
    }

    private findAndModifyOAuthToken(searchCriteria: OAuthTokenSearchCriteria, oAuthTokenDO: OAuthTokenDO) {
        return new Promise<OAuthTokenDO>((resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyOAuthTokenCore(searchCriteria, oAuthTokenDO, resolve, reject);
        });
    }

    private findAndModifyOAuthTokenCore(searchCriteria, updateQuery: any, resolve: { (result: OAuthTokenDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        delete updateQuery.versionId;
        var findQuery: Object = {
            "id": searchCriteria.id,
            "versionId": searchCriteria.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.OAuthTokenRepositoryErrorUpdatingToken, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating token - concurrency", { searchCriteria: searchCriteria, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { searchCriteria: searchCriteria, updateQuery: updateQuery }, ThStatusCode.OAuthTokenRepositoryErrorUpdatingToken);
            },
            (updatedDBOAuthToken: Object) => {
                var oAuthToken: OAuthTokenDO = new OAuthTokenDO();
                oAuthToken.buildFromObject(updatedDBOAuthToken);
                resolve(oAuthToken);
            }
        );
    }

    public deleteOAuthToken(searchCriteria: OAuthTokenSearchCriteria): Promise<number> {
        return new Promise<number>((resolve: { (deletedCount: number): void }, reject: { (err: ThError): void }) => {
            this.deleteOAuthTokenCore(searchCriteria, resolve, reject);
        });
    }

    public deleteOAuthTokenCore(searchCriteria: OAuthTokenSearchCriteria, resolve: { (deletedCount: number): void }, reject: { (err: ThError): void }) {
        let removeQuery = this.buildSearchCriteria(searchCriteria);
        
        return this.deleteOneDocument(removeQuery,
            (err: Error) => {
                this.logAndReject(err, reject, { searchCriteria: searchCriteria, removeQuery: removeQuery }, ThStatusCode.OAuthTokenErrorDeletingToken);
            },
            (deletedCount: number) => {
                resolve(deletedCount);
            });
    }

    public deleteMultipleOAuthTokens(searchCriteria: OAuthTokenSearchCriteria): Promise<number> {
        return new Promise<number>((resolve: { (deletedCount: number): void }, reject: { (err: ThError): void }) => {
            this.deleteMultipleOAuthTokensCore(searchCriteria, resolve, reject);
        });
    }

    private deleteMultipleOAuthTokensCore(searchCriteria: OAuthTokenSearchCriteria, resolve: { (deletedCount: number): void }, reject: { (err: ThError): void }) {
        let removeQuery = this.buildSearchCriteria(searchCriteria);
        
        return this.deleteMultipleDocuments(removeQuery,
            (err: Error) => {
                this.logAndReject(err, reject, { searchCriteria: searchCriteria, removeQuery: removeQuery }, ThStatusCode.OAuthTokenErrorDeletingToken);
            },
            (deletedCount: number) => {
                resolve(deletedCount);
            });
    }

    private buildSearchCriteria(searchCriteria: OAuthTokenSearchCriteria): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.id)) {
            mongoQueryBuilder.addExactMatch("id", searchCriteria.id);
        }
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.versionId)) {
            mongoQueryBuilder.addExactMatch("versionId", searchCriteria.versionId);
        }
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.accessToken)) {
            mongoQueryBuilder.addExactMatch("accessToken", searchCriteria.accessToken);
        }
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.refreshToken)) {
            mongoQueryBuilder.addExactMatch("refreshToken", searchCriteria.refreshToken);
        }
        if (!this._thUtils.isUndefinedOrNull(searchCriteria.userId)) {
            mongoQueryBuilder.addExactMatch("userId", searchCriteria.userId);
        }
        return mongoQueryBuilder.processedQuery;
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error saving oauth token", context, thError);
        reject(thError);
    }
}