import {BaseDO} from '../../../../../common/base/BaseDO';
import {NotificationDO, ThNotificationCode} from './NotificationDO';

var ThNotificationMessage: { [index: number]: string; } = {};
ThNotificationMessage[ThNotificationCode.AllotmentArchivedAutomatically] = "Your allotment for the period %period% has been automatically archived as it reached the expired date.";

export class ThNotificationDO extends BaseDO {
	notification: NotificationDO;
	translatedMessage: string;

	constructor() {
        super();
	}
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["translatedMessage"];
    }
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        this.notification = new NotificationDO();
        this.notification.buildFromObject(
            this.getObjectPropertyEnsureUndefined(object, "notification"));
        this.convertTimestamp();
    } 
    
    private convertTimestamp() {
        this.notification.timestamp
    }
}