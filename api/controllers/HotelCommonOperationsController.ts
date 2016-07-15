import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {HotelTime} from '../core/domain-layer/hotel-operations/common/hotel-time/HotelTime';
import {ThTimestampDO} from '../core/utils/th-dates/data-objects/ThTimestampDO';

class HotelCommonOperationsController extends BaseController {

    public getCurrentHotelTimestamp(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var hotelTime = new HotelTime(appContext, sessionContext);
        hotelTime.getTimestamp().then((thTimestampDO: ThTimestampDO) => {
            this.returnSuccesfulResponse(req, res, { timestamp: thTimestampDO });
        }).catch((error: any) => {
            this.returnErrorResponse(req, res, error, ThStatusCode.HotelCommonOperationsControllerErrorGettingTimestamp);
        });
    }
}

var hotelCommonOperationsController = new HotelCommonOperationsController();
module.exports = {
    getCurrentHotelTimestamp: hotelCommonOperationsController.getCurrentHotelTimestamp.bind(hotelCommonOperationsController)
}