import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';

export class HotelTime {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getTimestamp(): Promise<ThTimestampDO> {
        return new Promise<ThTimestampDO>((resolve: { (result: ThTimestampDO): void }, reject: { (err: ThError): void }) => {
            this.getTimestampCore(resolve, reject);
        });
    }

    private getTimestampCore(resolve: { (result: ThTimestampDO): void }, reject: { (err: ThError): void }) {
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                if (this._thUtils.isUndefinedOrNull(loadedHotel.timezone)) {
                    var thError = new ThError(ThStatusCode.HotelTimeNullTimezone, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Error, "null hotel timezone", loadedHotel, thError);
                    throw thError;
                }
                var hotelTimestamp = ThTimestampDO.buildThTimestampForTimezone(loadedHotel.timezone);
                resolve(hotelTimestamp);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.HotelTimeError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error getting hotel time", this._sessionContext, thError);
                }
                reject(thError);
            });
    }
}