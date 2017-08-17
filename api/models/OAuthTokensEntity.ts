import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class OAuthTokensEntity extends BasePersistentEntity {
    static TableName = "OAuthTokens";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }

    private buildCustomAttributes() {
        this.attributes = {
            versionId: {
                type: 'integer',
                required: true,
                defaultsTo: 0
            },
            accessToken: {
                type: "string",
                required: true
            },
            accessTokenExpiresOn: {
                type: "float",
                required: true
            },
            refreshToken: {
                type: "string",
                required: true
            },
            refreshTokenExpiresOn: {
                type: "float",
                required: true
            },
            hotelId: {
                type: 'string',
                required: true
            },
            userId: {
                type: "string",
                required: true
            }
        };
    }
}

var model: OAuthTokensEntity = new OAuthTokensEntity(OAuthTokensEntity.TableName);
export = model;