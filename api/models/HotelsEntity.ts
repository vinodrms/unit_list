import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class HotelsEntity extends BasePersistentEntity {
    static TableName = "Hotels";

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
            contactDetails: {
                type: 'json',
                required: true
            },
            geoLocation: {
                type: 'json'
            },
			logoUrl: {
				type: 'string'
			},
			userList: {
				type: 'array',
				required: true
			},
			ccyCode: {
				type: 'string'
			},
			taxes: {
				type: 'json',
				defaultsTo: {}
			},
			amenityIdList: {
				type: 'array',
			},
			customAmenityList: {
				type: 'array',
			},
			configurationCompleted: {
				type: 'boolean',
			},
			configurationCompletedTimestamp: {
				type: 'json'
			},
			timezone: {
				type: 'string'
			},
			operationHours: {
				type: 'json',
				defaultsTo: {}
			},
			paymentMethodList: {
				type: 'array',
			}
		};
    }
}

var model: HotelsEntity = new HotelsEntity(HotelsEntity.TableName);
export = model;