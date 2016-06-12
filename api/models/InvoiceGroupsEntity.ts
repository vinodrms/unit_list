import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class InvoiceGroupsEntity extends BasePersistentEntity {
    static TableName = "InvoiceGroups";

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
            state: {
                type: 'integer',
                required: true
            },
            bookingId: {
                type: 'string'
            },
            invoiceList: {
                type: 'array',
                defaultsTo: []
            },
            status: {
                type: 'integer',
                required: true
            }
        }
    }
}

var model: InvoiceGroupsEntity = new InvoiceGroupsEntity(InvoiceGroupsEntity.TableName);
export = model;