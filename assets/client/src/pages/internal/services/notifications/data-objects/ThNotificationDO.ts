import {BaseDO} from '../../../../../common/base/BaseDO';
import {NotificationDO, ThNotificationCode} from './NotificationDO';
import {ThDateUtils} from '../../common/data-objects/th-dates/ThDateUtils';
import {ThTimestamp} from '../../common/data-objects/th-dates/ThTimestamp';

var ThNotificationMessage: { [index: number]: string; } = {};
ThNotificationMessage[ThNotificationCode.AllotmentArchivedAutomatically] = "Your allotment for the period %period% has been automatically archived as it reached the expired date.";

export class ThNotificationDO extends BaseDO {
    notification: NotificationDO;
    translatedMessage: string;
    thTimestamp: ThTimestamp;

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
        this.thTimestamp = (new ThDateUtils()).convertTimestampToThTimestamp(this.notification.timestamp);
    }
    
    public get thTimestampString(): string {
        return this.thTimestamp.toString();
    }
}