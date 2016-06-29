import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {BookingDO, GroupBookingInputChannel} from '../core/data-layer/bookings/data-objects/BookingDO';
import {BookingMetaRepoDO, BookingSearchResultRepoDO} from '../core/data-layer/bookings/repositories/IBookingRepository';
import {LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {BookingSearch} from '../core/domain-layer/bookings/search-bookings/BookingSearch';
import {BookingSearchResult} from '../core/domain-layer/bookings/search-bookings/utils/result-builder/BookingSearchResult';
import {AddBookingItems} from '../core/domain-layer/bookings/add-bookings/AddBookingItems';

class BookingsController extends BaseController {
    public getBookingById(req: Express.Request, res: Express.Response) {
        if (!this.precheckGETParameters(req, res, ['groupBookingId', 'bookingId'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingMeta = this.getBookingMetaRepoDOFrom(sessionContext);
        var groupBookingId = req.query.groupBookingId;
        var bookingId = req.query.bookingId;

        var bookingRepo = appContext.getRepositoryFactory().getBookingRepository();
        bookingRepo.getBookingById(bookingMeta, groupBookingId, bookingId).then((booking: BookingDO) => {
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorGettingBookingById);
        });
    }

    public getBookingList(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingMeta = this.getBookingMetaRepoDOFrom(sessionContext);
        var bookingRepo = appContext.getRepositoryFactory().getBookingRepository();
        bookingRepo.getBookingList(bookingMeta, req.body.searchCriteria, req.body.lazyLoad).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            this.returnSuccesfulResponse(req, res, bookingSearchResult);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorGettingBookings);
        });
    }

    public getBookingListCount(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingMeta = this.getBookingMetaRepoDOFrom(sessionContext);
        var bookingRepo = appContext.getRepositoryFactory().getBookingRepository();
        bookingRepo.getBookingListCount(bookingMeta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
            this.returnSuccesfulResponse(req, res, lazyLoadMeta);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorGettingCount);
        });
    }

    public searchBookings(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingSearch = new BookingSearch(appContext, sessionContext);
        bookingSearch.search(req.body.searchParams).then((bookingSearchResult: BookingSearchResult) => {
            this.returnSuccesfulResponse(req, res, { searchResult: bookingSearchResult });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorSearchingBookings);
        });
    }

    public addBookings(req: Express.Request, res: Express.Response) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var addBookingItems = new AddBookingItems(appContext, sessionContext);
        addBookingItems.add(req.body.bookingItems, GroupBookingInputChannel.PropertyManagementSystem).then((addedBookingList: BookingDO[]) => {
            this.returnSuccesfulResponse(req, res, { bookingList: addedBookingList });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorAddingBookings);
        });
    }

    private getBookingMetaRepoDOFrom(sessionContext: SessionContext): BookingMetaRepoDO {
        return { hotelId: sessionContext.sessionDO.hotel.id };
    }
}

var bookingsController = new BookingsController();
module.exports = {
    getBookingById: bookingsController.getBookingById.bind(bookingsController),
    getBookingList: bookingsController.getBookingList.bind(bookingsController),
    getBookingListCount: bookingsController.getBookingListCount.bind(bookingsController),
    searchBookings: bookingsController.searchBookings.bind(bookingsController),
    addBookings: bookingsController.addBookings.bind(bookingsController)
}