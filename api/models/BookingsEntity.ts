import { BasePersistentEntity } from '../core/utils/entities/BasePersistentEntity';

class BookingsEntity extends BasePersistentEntity {
    static TableName = "Bookings";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
            groupBookingId: {
                type: 'string',
                required: true
            },
            groupBookingReference: {
                type: 'string',
                required: true
            },
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
            inputChannel: {
                type: 'integer'
            },
            noOfRooms: {
                type: 'integer'
            },
            bookingReference: {
                type: 'string',
                required: true
            },
            externalBookingReference: {
                type: 'string',
                required: true
            },
            confirmationStatus: {
                type: 'integer',
                required: true
            },
            customerIdList: {
                type: 'array',
                defaultsTo: []
            },
            displayCustomerId: {
                type: 'string',
                required: true
            },
            defaultBillingDetails: {
                type: 'json',
                required: true
            },
            interval: {
                type: 'json',
                required: true
            },
            creationDate: {
                type: 'json',
                required: true
            },
            startUtcTimestamp: {
                type: 'float',
                required: true
            },
            endUtcTimestamp: {
                type: 'float',
                required: true
            },
            configCapacity: {
                type: 'json',
                required: true
            },
            roomCategoryId: {
                type: 'string',
                required: true
            },
            roomId: {
                type: 'string'
            },
            priceProductId: {
                type: 'string',
                required: true
            },
            priceProductSnapshot: {
                type: 'json',
                required: true
            },
            reservedAddOnProductIdList: {
                type: 'array',
                defaultsTo: []
            },
            price: {
                type: 'json',
                required: true
            },
            allotmentId: {
                type: 'string'
            },
            guaranteedTime: {
                type: 'json'
            },
            noShowTime: {
                type: 'json'
            },
            notes: {
                type: 'string'
            },
            invoiceNotes: {
                type: 'string'
            },
            fileAttachmentList: {
                type: 'array',
                defaultsTo: []
            },
            bookingHistory: {
                type: 'json'
            },
            indexedSearchTerms: {
                type: 'array',
                defaultsTo: []
            },
        }
    }
}
var model: BookingsEntity = new BookingsEntity(BookingsEntity.TableName);
export = model;