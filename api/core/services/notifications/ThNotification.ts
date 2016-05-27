import {Locales, Translation} from '../../utils/localization/Translation';
import {ThNotificationCode} from '../../data-layer/common/data-objects/notifications/ThNotificationCode';
import {NotificationDO} from '../../data-layer/common/data-objects/notifications/NotificationDO';

import _ = require('underscore');

var ThNotificationMessage: { [index: number]: string; } = {};
ThNotificationMessage[ThNotificationCode.AllotmentArchivedAutomatically] = "Your allotment for the period %period% has been automatically archived as it reached the expired date.";

export class ThNotification {
	notification: NotificationDO;
	translatedMessage: string;

	constructor(notification: NotificationDO, locale: Locales) {
		this.notification = notification;
		this.buildTranslatedMessage(locale);
	}
    private buildTranslatedMessage(locale: Locales) {
        var translation = new Translation(locale);
        this.translatedMessage = translation.getTranslation(ThNotificationMessage[this.notification.code], this.notification.parameterMap);
    }

	public static buildThNotificationList(notificationList: NotificationDO[], locale: Locales): ThNotification[] {
		var convertedThNotificationList: ThNotification[] = [];
		if (!_.isArray(notificationList)) {
			return convertedThNotificationList;
		}
		_.forEach(notificationList, (notification: NotificationDO) => {
			var thNotification: ThNotification = new ThNotification(notification, locale);
			convertedThNotificationList.push(thNotification);
		});
		return convertedThNotificationList;
	}
}