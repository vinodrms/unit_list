import _ = require('underscore');
import { BaseController } from './base/BaseController';
import { ThStatusCode } from '../core/utils/th-responses/ThResponse';
import { AppContext } from '../core/utils/AppContext';
import { SessionContext } from '../core/utils/SessionContext';
import { BookingDO, GroupBookingInputChannel } from '../core/data-layer/bookings/data-objects/BookingDO';
import { BookingMetaRepoDO, BookingSearchResultRepoDO } from '../core/data-layer/bookings/repositories/IBookingRepository';
import { LazyLoadMetaResponseRepoDO } from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import { BookingSearch } from '../core/domain-layer/bookings/search-bookings/BookingSearch';
import { BookingSearchResult } from '../core/domain-layer/bookings/search-bookings/utils/result-builder/BookingSearchResult';
import { AddBookingItems } from '../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { ThTranslation } from '../core/utils/localization/ThTranslation';
import { BookingOccupancyCalculatorWrapper } from '../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/wrapper/BookingOccupancyCalculatorWrapper';
import { BookingOccupancyDO } from '../core/domain-layer/bookings/search-bookings/utils/occupancy-calculator/results/BookingOccupancyDO';

class BookingsController extends BaseController {
    public getBookingById(req: any, res: any) {
        if (!this.precheckGETParameters(req, res, ['bookingId'])) { return };

        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingMeta = this.getBookingMetaRepoDOFrom(sessionContext);
        var bookingId = req.query.bookingId;

        var bookingRepo = appContext.getRepositoryFactory().getBookingRepository();
        bookingRepo.getBookingById(bookingMeta, bookingId).then((booking: BookingDO) => {
            this.translateBookingHistory(booking, this.getThTranslation(sessionContext));
            this.returnSuccesfulResponse(req, res, { booking: booking });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorGettingBookingById);
        });
    }

    public getBookingList(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingMeta = this.getBookingMetaRepoDOFrom(sessionContext);
        var bookingRepo = appContext.getRepositoryFactory().getBookingRepository();
        bookingRepo.getBookingList(bookingMeta, req.body.searchCriteria, req.body.lazyLoad).then((bookingSearchResult: BookingSearchResultRepoDO) => {
            this.translateBookingListHistory(bookingSearchResult.bookingList, sessionContext);
            this.returnSuccesfulResponse(req, res, bookingSearchResult);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorGettingBookings);
        });
    }

    public getBookingListCount(req: any, res: any) {
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

    public searchBookings(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var bookingSearch = new BookingSearch(appContext, sessionContext);
        bookingSearch.search(req.body.searchParams).then((bookingSearchResult: BookingSearchResult) => {
            this.returnSuccesfulResponse(req, res, { searchResult: bookingSearchResult });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorSearchingBookings);
        });
    }

    public addBookings(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var addBookingItems = new AddBookingItems(appContext, sessionContext);
        addBookingItems.add(req.body.bookingItems, GroupBookingInputChannel.PropertyManagementSystem).then((addedBookingList: BookingDO[]) => {
            this.translateBookingListHistory(addedBookingList, sessionContext);
            this.returnSuccesfulResponse(req, res, { bookingList: addedBookingList });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorAddingBookings);
        });
    }

    public getOccupancy(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

        var occupancyCalculator = new BookingOccupancyCalculatorWrapper(appContext, sessionContext);
        occupancyCalculator.compute(req.body.filters).then((bookingOccupancy: BookingOccupancyDO) => {
            this.returnSuccesfulResponse(req, res, { bookingOccupancy: bookingOccupancy });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.BookingsControllerErrorAddingBookings);
        });
    }

    private getBookingMetaRepoDOFrom(sessionContext: SessionContext): BookingMetaRepoDO {
        return { hotelId: sessionContext.sessionDO.hotel.id };
    }
    private translateBookingListHistory(bookingList: BookingDO[], sessionContext: SessionContext) {
        var thTranslation = this.getThTranslation(sessionContext);
        _.forEach(bookingList, (booking: BookingDO) => {
            this.translateBookingHistory(booking, thTranslation);
        });
    }
    private translateBookingHistory(booking: BookingDO, thTranslation: ThTranslation) {
        booking.bookingHistory.translateActions(thTranslation);
    }
}

var bookingsController = new BookingsController();
module.exports = {
    getBookingById: bookingsController.getBookingById.bind(bookingsController),
    getBookingList: bookingsController.getBookingList.bind(bookingsController),
    getBookingListCount: bookingsController.getBookingListCount.bind(bookingsController),
    searchBookings: bookingsController.searchBookings.bind(bookingsController),
    addBookings: bookingsController.addBookings.bind(bookingsController),
    getOccupancy: bookingsController.getOccupancy.bind(bookingsController)
}
