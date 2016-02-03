import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class HotelsEntity extends BasePersistentEntity {
    static TableName = "Hotels";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
            name: {
                type: 'string',
                required: true
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
				type: 'json',
				required: true
			},
			ccy: {
				type: 'string',
				required: true
			},
			taxes: {
				type: 'json',
			},
			settings: {
				type: 'json'
			},
			timezone: {
				type: 'json'
			},
			operationHoues: {
				type: 'json'
			}
		};
    }
}

var model: HotelsEntity = new HotelsEntity(HotelsEntity.TableName);
export = model;