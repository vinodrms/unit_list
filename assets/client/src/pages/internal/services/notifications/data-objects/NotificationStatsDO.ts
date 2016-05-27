import {BaseDO} from '../../../../../common/base/BaseDO';
import {ThNotificationDO} from './ThNotificationDO';

export class NotificationStatsDO extends BaseDO {
    numUnread: number;
    notificationList: ThNotificationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["numUnread"];
    }
    
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.notificationList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "notificationList"), (notificationObj: Object) => {
			var notification = new ThNotificationDO();
			notification.buildFromObject(notificationObj);
			this.notificationList.push(notification);
		});
    }
}