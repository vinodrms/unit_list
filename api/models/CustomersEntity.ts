import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class CustomersEntity extends BasePersistentEntity {
    static TableName = "Customers";

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
            hotelId: {
                type: 'string',
                required: true
            },
            type: {
                type: 'integer',
                required: true
            },
			status: {
                type: 'integer',
                required: true
            },
			customerDetails: {
                type: 'json',
                required: true
            },
			fileAttachmentUrlList: {
				type: 'array',
				defaultsTo: []
			},
			priceProductDetails: {
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

var model: CustomersEntity = new CustomersEntity(CustomersEntity.TableName);
export = model;