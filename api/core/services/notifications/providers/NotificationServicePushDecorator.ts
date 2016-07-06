import {AppContext} from '../../../utils/AppContext';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {INotificationService} from '../INotificationService';
import {NotificationDO} from '../../../data-layer/common/data-objects/notifications/NotificationDO';
import {ThError} from '../../../utils/th-responses/ThError';
import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';
import {INotificationsRepository, NotificationRepoDO} from '../../../data-layer/notifications/repositories/INotificationsRepository';
import {ISocketsService, SocketSendMessageReq} from '../../sockets/ISocketsService';
import {ThNotification} from '../ThNotification';
import {Locales} from '../../../utils/localization/ThTranslation';

export class NotificationServicePushDecorator implements INotificationService {

    constructor(private _notificationServiceToBeDecorated: INotificationService, private _socketsService: ISocketsService) {
	}

	public addNotification(notification: NotificationDO): Promise<NotificationDO> {
		return new Promise<NotificationDO>((resolve: { (result: NotificationDO): void }, reject: { (err: ThError): void }) => {
			this.addNotificationCore(resolve, reject, notification);
		});
	}
	private addNotificationCore(resolve: { (result: NotificationDO): void }, reject: { (err: ThError): void }, notification: NotificationDO) {
		this._notificationServiceToBeDecorated.addNotification(notification).then((notification: NotificationDO) => {
			return this._socketsService.emitMessage(this.buildSocketSendMessageReq(notification));
		}).then((result: boolean) => {
			resolve(notification);	
		}).catch((err: ThError) => {
			var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorAddingNotification, null);
			reject(thError);
		});
	}

	public getUndeliveredNotifications(meta: NotificationRepoDO.Meta): Promise<NotificationDO[]> {
		return this._notificationServiceToBeDecorated.getUndeliveredNotifications(meta);
	}

	private buildSocketSendMessageReq(notification: NotificationDO): SocketSendMessageReq {
		var thNotification = new ThNotification(notification, Locales.English);

		return {
			roomId: notification.hotelId,
			event: 'NewNotification',
			message: {
				content: thNotification.translatedMessage
			}
		}
	}
}