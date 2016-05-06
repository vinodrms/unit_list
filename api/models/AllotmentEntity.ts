import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class AllotmentEntity extends BasePersistentEntity {
    static TableName = "Allotments";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
			hotelId: {
                type: 'string',
                required: true
            },
			versionId: {
				type: 'integer',
				required: true,
				defaultsTo: 0
			},
            status: {
                type: 'integer',
                required: true
            },
			customerId: {
				type: 'string',
				required: true
			},
			priceProductId: {
				type: 'string',
				required: true
			},
			roomCategoryId: {
				type: 'string',
				required: true
			},
			openInterval: {
				type: 'json',
				required: true
			},
			availability: {
				type: 'json',
				required: true
			},
			inventory: {
				type: 'json',
				required: true
			},
			constraints: {
				type: 'json',
				required: true
			},
			notes: {
				type: 'string',
				defaultsTo: ""
			}
		};
    }
}

var model: AllotmentEntity = new AllotmentEntity(AllotmentEntity.TableName);
export = model;