import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class AddOnProductEntity extends BasePersistentEntity {
    static TableName = "AddOnProducts";

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
			categoryId: {
				type: 'string',
				required: true
			},
			name: {
                type: 'string',
                required: true
            },
			price: {
                type: 'float',
                required: true
            },
			taxIdList: {
                type: 'array',
                required: true,
				defaultsTo: []
            },
			notes: {
				type: 'string',
				defaultsTo: ""
			}
		};
    }
}

var model: AddOnProductEntity = new AddOnProductEntity(AddOnProductEntity.TableName);
export = model;