import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {EmailConfirmation} from '../core/domain-layer/hotel-operations/common/email-confirmations/EmailConfirmation';

class HotelCommonOperationsController extends BaseController {
    public sendEmail(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var emailConfirmation = new EmailConfirmation(appContext, sessionContext);
        emailConfirmation.send(req.body.emailConfig).then((result: boolean) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelCommonOperationsControllerEmailError);
        });
    }
}

var hotelCommonOperationsController = new HotelCommonOperationsController();
module.exports = {
    sendEmail: hotelCommonOperationsController.sendEmail.bind(hotelCommonOperationsController)
}