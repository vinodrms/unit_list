import {INotificationService} from '../INotificationService';
import {ThNotification} from '../ThNotification';
import {ThError} from '../../../utils/th-responses/ThError';

export class MockNotificationService implements INotificationService {
	public sendNotification(notification: ThNotification): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			resolve(true);
		});
	}
}