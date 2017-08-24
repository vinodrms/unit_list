import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { EmailConfirmationParams } from './utils/EmailConfirmationParams';

@Injectable()
export class HotelOperationsCommonService {

    constructor(private _appContext: AppContext) {
    }

    public sendEmail(emailConfig: EmailConfirmationParams): Observable<boolean> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.HotelOperationsCommonSendEmail,
            parameters: {
                emailConfig: emailConfig
            }
        }).map((result: boolean) => {
            return result;
        });
    }

}