import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {HotelOperationsQueryDO} from './HotelOperationsQueryDO';
import {ThDateDO} from '../../../../utils/th-dates/data-objects/ThDateDO';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {HotelTime} from '../hotel-time/HotelTime';

export class HotelOperationsQueryDOParser {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public parse(query: HotelOperationsQueryDO): Promise<HotelOperationsQueryDO> {
        return new Promise<HotelOperationsQueryDO>((resolve: { (result: HotelOperationsQueryDO): void }, reject: { (err: ThError): void }) => {
            this.parseCore(resolve, reject, query);
        });
    }

    private parseCore(resolve: { (result: HotelOperationsQueryDO): void }, reject: { (err: ThError): void }, query: HotelOperationsQueryDO) {
        var parsedQuery = new HotelOperationsQueryDO();
        if (!this._thUtils.isUndefinedOrNull(query.referenceDate)) {
            var validationResult = HotelOperationsQueryDO.getValidationStructure().validateStructure(query);
            if (validationResult.isValid()) {
                var parsedDate = new ThDateDO();
                parsedDate.buildFromObject(query.referenceDate);
                if (parsedDate.isValid()) {
                    parsedQuery.referenceDate = parsedDate;
                    resolve(parsedQuery);
                    return;
                }
            }
        }
        var hotelTime = new HotelTime(this._appContext, this._sessionContext);
        hotelTime.getTimestamp().then((timestamp: ThTimestampDO) => {
            parsedQuery.referenceDate = timestamp.thDateDO;
            resolve(parsedQuery);
        }).catch((err: any) => {
            reject(err);
        });
    }
}