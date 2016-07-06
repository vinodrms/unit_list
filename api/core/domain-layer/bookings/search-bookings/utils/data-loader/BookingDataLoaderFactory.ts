import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThUtils} from '../../../../../utils/ThUtils';
import {IBookingDataLoader} from './IBookingDataLoader';
import {PublicBookingDataLoader} from './strategies/PublicBookingDataLoader';
import {PrivateBookingDataLoader} from './strategies/PrivateBookingDataLoader';

export class BookingDataLoaderFactory {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getDataLoader(customerId: string): IBookingDataLoader {
        if (this._thUtils.isUndefinedOrNull(customerId)) {
            return new PublicBookingDataLoader(this._appContext, this._sessionContext);
        }
        return new PrivateBookingDataLoader(this._appContext, this._sessionContext, customerId);
    }
}