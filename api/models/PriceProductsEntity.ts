import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

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
			addOnProductIdList: {
				type: 'array',
				defaultsTo: []
			},
			roomCategoryIdList: {
				type: 'array',
				required: true
			},
			price: {
                type: 'json',
                required: true
            },
			taxIdList: {
                type: 'array',
                required: true,
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
			conditions: {
				type: 'json',
				required: true
			}
		};
    }
}

var model: PriceProductsEntity = new PriceProductsEntity(PriceProductsEntity.TableName);
export = model;