import {ThNotification} from './ThNotification';

export interface INotificationService {
	sendNotification(notification: ThNotification): Promise<boolean>;
}