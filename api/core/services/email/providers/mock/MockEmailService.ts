import {AEmailService} from '../../AEmailService';

export class MockEmailService extends AEmailService {
    public sendEmail(): Promise<any> {
        return new Promise<Object>((resolve, reject) => {
            resolve("ok");
        });
    }
}