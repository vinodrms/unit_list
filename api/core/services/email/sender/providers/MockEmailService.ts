import {AEmailService} from '../AEmailService';

export class MockEmailService extends AEmailService {
    protected sendEmail(): Promise<any> {
        return new Promise<Object>((resolve, reject) => {
            resolve("ok");
        });
    }
}