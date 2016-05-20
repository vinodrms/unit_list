import {BasePersistentEntity} from '../core/utils/entities/BasePersistentEntity';

class NotificationsEntity extends BasePersistentEntity {
    static TableName = "Notifications";

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
			userId: {
                type: 'string',
                required: true
            },            
            code: {
                type: 'integer',
                required: true
            },
            parameterMap: {
                type: 'json',
                defaultsTo: {}
            },
            timestamp: {
                type: 'integer',
                required: true
            },
            // delivered = true if the notification was surfaced to
            // the user, false otherwise. When a new notification is
            // produced, this is set to false.
            delivered: {
                type: 'boolean',
                required: true,
                defaultsTo: false
            }
		};
    }
}

var model: NotificationsEntity = new NotificationsEntity(NotificationsEntity.TableName);
export = model;