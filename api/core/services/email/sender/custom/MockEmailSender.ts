import {AEmailSender} from '../AEmailSender';

export class MockEmailSender extends AEmailSender {
	protected sendEmail() : Promise<any> {
		return new Promise<Object>((resolve, reject) => {
			resolve("ok");
		});
	}
}