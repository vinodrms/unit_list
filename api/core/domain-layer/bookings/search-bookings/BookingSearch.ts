import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {BookingSearchDO} from './BookingSearchDO';
import {BookingSearchResult} from './utils/result/BookingSearchResult';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {BookingIntervalValidator} from '../validators/BookingIntervalValidator';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {BookingDataLoaderFactory} from './utils/data-loader/BookingDataLoaderFactory';
import {IBookingDataLoader} from './utils/data-loader/IBookingDataLoader';
import {BookingSearchDependencies} from './utils/data-loader/results/BookingSearchDependencies';

export class BookingSearch {
    private _searchParams: BookingSearchDO;

    private _loadedHotel: HotelDO;
    private _loadedBookingSearchDependencies: BookingSearchDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public search(searchParams: BookingSearchDO): Promise<BookingSearchResult> {
        this._searchParams = searchParams;
        return new Promise<BookingSearchResult>((resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) => {
            this.searchCore(resolve, reject);
        });
    }

    private searchCore(resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingSearchDO.getValidationStructure().validateStructure(this._searchParams);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._searchParams);
            parser.logAndReject("Error validating data search bookings", reject);
            return;
        }

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var intervalValidator = new BookingIntervalValidator(loadedHotel);
                return intervalValidator.validateBookingInterval(this._searchParams.interval);
            }).then((validatedBookingInterval: ThDateIntervalDO) => {
                this._searchParams.interval = validatedBookingInterval;

                var dataLoaderFactory = new BookingDataLoaderFactory(this._appContext, this._sessionContext);
                var dataLoader: IBookingDataLoader = dataLoaderFactory.getDataLoader(this._searchParams.customerId);
                return dataLoader.loadData();
            }).then((bookingSearchData: BookingSearchDependencies) => {
                this._loadedBookingSearchDependencies = bookingSearchData;

                // TODO

            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingSearchError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error searching bookings", this._searchParams, thError);
                }
                reject(thError);
            });
    }
}