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
			users: {
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
			amenityIds: {
				type: 'array',
			},
			customAmenities: {
				type: 'array',
			},
			paymentMethodIds: {
				type: 'array',
			},
			configurationStatus: {
				type: 'boolean',
			},
			timezone: {
				type: 'string'
			},
			operationHours: {
				type: 'json',
				defaultsTo: {}
			}
		};
    }
}

var model: HotelsEntity = new HotelsEntity(HotelsEntity.TableName);
export = model;