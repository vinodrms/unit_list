import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { BookingWithDependencies } from './BookingWithDependencies';
import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { PriceProductIdValidator } from '../../../price-products/validators/PriceProductIdValidator';
import { PriceProductsContainer } from '../../../price-products/validators/results/PriceProductsContainer';
import { AllotmentIdValidator } from '../../../allotments/validators/AllotmentIdValidator';
import { AllotmentsContainer } from '../../../allotments/validators/results/AllotmentsContainer';
import { RoomSearchResultRepoDO } from '../../../../data-layer/rooms/repositories/IRoomRepository';
import { RoomCategoryStatsAggregator } from '../../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { CustomerDO } from "../../../../data-layer/customers/data-objects/CustomerDO";

export class BookingWithDependenciesLoader {
    private _groupBookingId: string;
    private _bookingId: string;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public load(groupBookingId: string, bookingId: string): Promise<BookingWithDependencies> {
        this._groupBookingId = groupBookingId;
        this._bookingId = bookingId;
        return new Promise<BookingWithDependencies>((resolve: { (result: BookingWithDependencies): void }, reject: { (err: ThError): void }) => {
            this.loadCore(resolve, reject);
        });
    }
    private loadCore(resolve: { (result: BookingWithDependencies): void }, reject: { (err: ThError): void }) {
        var bookingWithDependencies = new BookingWithDependencies();
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._groupBookingId, this._bookingId)
            .then((bookingDO: BookingDO) => {
                bookingWithDependencies.bookingDO = bookingDO;

                var priceProductIdListToValidate = [bookingDO.priceProductId];
                var priceProductValidator = new PriceProductIdValidator(this._appContext, this._sessionContext);
                return priceProductValidator.validatePriceProductIdList(priceProductIdListToValidate);
            }).then((loadedPriceProductsContainer: PriceProductsContainer) => {
                bookingWithDependencies.priceProductsContainer = loadedPriceProductsContainer;

                var allotmentValidator = new AllotmentIdValidator(this._appContext, this._sessionContext);
                var allotmentIdListToValidate = [];
                if (bookingWithDependencies.bookingDO.isMadeThroughAllotment()) {
                    allotmentIdListToValidate = [bookingWithDependencies.bookingDO.allotmentId];
                }
                return allotmentValidator.validateAllotmentIdList({
                    allotmentIdList: allotmentIdListToValidate,
                    onlyActive: false
                });
            }).then((loadedAllotmentsContainer: AllotmentsContainer) => {
                bookingWithDependencies.allotmentsContainer = loadedAllotmentsContainer;

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                bookingWithDependencies.roomList = roomSearchResult.roomList;

                var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
                return roomCategStatsAggregator.getRoomCategoryStatsList();
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                bookingWithDependencies.roomCategoryStatsList = roomCategoryStatsList;

                var invoiceGroupsRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
                return invoiceGroupsRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._groupBookingId,
                    bookingId: this._bookingId
                });
            }).then((invoiceGroupSearchResult: InvoiceGroupSearchResultRepoDO) => {
                bookingWithDependencies.invoiceGroupList = invoiceGroupSearchResult.invoiceGroupList;

                let customerRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
                return customerRepo.getCustomerById({ hotelId: this._sessionContext.sessionDO.hotel.id }, bookingWithDependencies.bookingDO.defaultBillingDetails.customerId);
            }).then((customer: CustomerDO) => {
                bookingWithDependencies.billingCustomer = customer;

                resolve(bookingWithDependencies);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingWithDependenciesLoaderError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error loading booking dependencies", { sessionContext: this._sessionContext }, thError);
                }
                reject(thError);
            });
    }
}