import { BasePersistentEntity } from '../core/utils/entities/BasePersistentEntity';

class PriceProductsEntity extends BasePersistentEntity {
	static TableName = "PriceProducts";

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
			parentId: {
				type: 'string',
				defaultsTo: ""
			},
			name: {
				type: 'string',
				required: true
			},
			availability: {
				type: 'integer',
				required: true
			},
			lastRoomAvailability: {
				type: 'boolean',
				required: true
			},
			includedItems: {
				type: 'json',
				defaultsTo: []
			},
			roomCategoryIdList: {
				type: 'array',
				defaultsTo: []
			},
			price: {
				type: 'json',
				required: true
			},
			taxIdList: {
				type: 'array',
				defaultsTo: []
			},
			openIntervalList: {
				type: 'array',
				required: true
			},
			openForArrivalIntervalList: {
				type: 'array',
				required: true
			},
			openForDepartureIntervalList: {
				type: 'array',
				required: true
			},
			yieldFilterList: {
				type: 'array',
				defaultsTo: []
			},
			constraints: {
				type: 'json',
				required: true
			},
			discounts: {
				type: 'json',
				required: true
			},
			conditions: {
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

var model: PriceProductsEntity = new PriceProductsEntity(PriceProductsEntity.TableName);
export = model;