import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class BookingGroupsEntity extends BasePersistentEntity {
    static TableName = "BookingGroups";

    constructor(tableName: string) {
        super(tableName);
        this.buildCustomAttributes();
    }
    private buildCustomAttributes() {
        this.attributes = {
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
            bookingList: {
                type: 'array',
                defaultsTo: []
            }
        }
    }
}
var model: BookingGroupsEntity = new BookingGroupsEntity(BookingGroupsEntity.TableName);
export = model;