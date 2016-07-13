import {Locales, ThTranslation} from '../../utils/localization/ThTranslation';
import {ThNotificationCode} from '../../data-layer/common/data-objects/notifications/ThNotificationCode';
import {NotificationDO} from '../../data-layer/common/data-objects/notifications/NotificationDO';

import _ = require('underscore');

var ThNotificationMessage: { [index: number]: string; } = {};
ThNotificationMessage[ThNotificationCode.AllotmentArchivedAutomatically] = "Your allotment for the period %period% has been automatically archived as it reached the expired date.";
ThNotificationMessage[ThNotificationCode.BookingsMarkedAsGuaranteed] = "The system has changed automatically some of your bookings. The number of bookings marked as Guaranteed is: %noBookings%.";
ThNotificationMessage[ThNotificationCode.BookingsMarkedAsNoShow] = "The system has changed automatically some of your bookings. The number of bookings marked as No Show is: %noBookings%.";
ThNotificationMessage[ThNotificationCode.BookingsMarkedAsNoShowWithPenalty] = "The system has changed automatically some of your bookings. The number of bookings marked as No Show is: %noBookings% / %noBookingsWithPenalty% with penalty.";

export class ThNotification {
	notification: NotificationDO;
	translatedMessage: string;

	constructor(notification: NotificationDO, locale: Locales) {
		this.notification = notification;
		this.buildTranslatedMessage(locale);
	}
    private buildTranslatedMessage(locale: Locales) {
        var translation = new ThTranslation(locale);
        this.translatedMessage = translation.translate(ThNotificationMessage[this.notification.code], this.notification.parameterMap);
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