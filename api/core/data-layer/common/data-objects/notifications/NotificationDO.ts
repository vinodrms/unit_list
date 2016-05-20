import {BaseDO} from '../../base/BaseDO';
import {ThNotificationCode} from './ThNotificationCode';

export interface NotificationBuilderDO {
    hotelId: string;
    userId?: string;
    code: ThNotificationCode;
    parameterMap: Object;
}

export class NotificationDO extends BaseDO {
    id: string;
    hotelId: string;
    userId: string;
    code: ThNotificationCode;
    parameterMap: Object = {};
    timestamp: number;
    delivered: boolean = false;

    protected getPrimitivePropertyKeys(): string[] {
        // Note: even though parameterMap is not of a primitive type, we want
        // it copied "as-is" (without any transformation). Hence, add it to this
        // list.
        return [
            "id", "hotelId", "userId", "code", "parameterMap",
            "timestamp", "delivered"];
    }

    public static buildNotificationDO(builderDO: NotificationBuilderDO): NotificationDO {
        var notification = new NotificationDO();
        notification.hotelId = builderDO.hotelId;
        notification.userId = builderDO.userId;
        notification.code = builderDO.code;
        notification.parameterMap = builderDO.parameterMap;
        notification.timestamp = (new Date()).getTime();
        notification.delivered = false;
        return notification;
    }
}