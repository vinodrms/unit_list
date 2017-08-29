import { BasePersistentEntity } from '../core/utils/entities/BasePersistentEntity';

class InvoicesEntity extends BasePersistentEntity {
    static TableName = "Invoices";

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
                type: 'string'
            },
            status: {
                type: 'integer',
                required: true
            },
            groupId: {
                type: 'string',
                required: true
            },
            reference: {
                type: 'string',
                required: true
            },
            paymentStatus: {
                type: 'integer',
                required: true
            },
            indexedCustomerIdList: {
                type: 'array',
                defaultsTo: []
            },
            indexedBookingIdList: {
                type: 'array',
                defaultsTo: []
            },
            vatTaxListSnapshot: {
                type: 'array',
                defaultsTo: []
            },
            reinstatedInvoiceId: {
                type: 'string'
            },
            notesFromBooking: {
                type: 'string',
                defaultsTo: ""
            },
            itemList: {
                type: 'array',
                defaultsTo: []
            },
            payerList: {
                type: 'array',
                defaultsTo: []
            },
            paidTimestamp: {
                type: 'float'
            }
        }
    }
}

var model: InvoicesEntity = new InvoicesEntity(InvoicesEntity.TableName);
export = model;
