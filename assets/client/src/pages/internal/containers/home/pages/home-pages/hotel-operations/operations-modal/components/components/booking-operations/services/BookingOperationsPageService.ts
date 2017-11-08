import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { ThError, AppContext } from '../../../../../../../../../../../../common/utils/AppContext';
import { EagerBookingsService } from '../../../../../../../../../../services/bookings/EagerBookingsService';
import { BookingDO } from '../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { HotelAggregatorService } from '../../../../../../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { RoomCategoriesStatsService } from '../../../../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { RoomCategoryStatsDO } from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomsService } from '../../../../../../../../../../services/rooms/RoomsService';
import { RoomVM } from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import { EagerCustomersService } from '../../../../../../../../../../services/customers/EagerCustomersService';
import { EagerAllotmentsService } from '../../../../../../../../../../services/allotments/EagerAllotmentsService';
import { AllotmentDO } from '../../../../../../../../../../services/allotments/data-objects/AllotmentDO';
import { CustomersDO } from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { EagerAddOnProductsService } from '../../../../../../../../../../services/add-on-products/EagerAddOnProductsService';
import { AddOnProductsDO } from '../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import { BookingOperationsPageData } from './utils/BookingOperationsPageData';
import { HotelBookingOperationsPageParam } from '../utils/HotelBookingOperationsPageParam';
import { HotelOperationsInvoiceService } from "../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceDO } from "../../../../../../../../../../services/invoices/data-objects/InvoiceDO";

@Injectable()
export class BookingOperationsPageService {

    constructor(private context: AppContext,
        private eagerBookingsService: EagerBookingsService,
        private hotelAggregatorService: HotelAggregatorService,
        private roomCategoriesStatsService: RoomCategoriesStatsService,
        private roomsService: RoomsService,
        private eagerCustomersService: EagerCustomersService,
        private eagerAllotmentsService: EagerAllotmentsService,
        private invoiceService: HotelOperationsInvoiceService,
        private eagerAddOnProductsService: EagerAddOnProductsService) {
    }

    public getPageData(pageParam: HotelBookingOperationsPageParam): Observable<BookingOperationsPageData> {
        return Observable.combineLatest(
            this.eagerBookingsService.getBooking(pageParam.bookingId),
            this.hotelAggregatorService.getHotelAggregatedInfo()
        ).flatMap((result: [BookingDO, HotelAggregatedInfo]) => {
            var pageData = new BookingOperationsPageData();
            pageData.bookingDO = result[0];
            pageData.ccy = result[1].ccy;
            pageData.allowedPaymentMethods = result[1].allowedPaymentMethods;
            pageData.allPaymentMethods = result[1].allAvailablePaymentMethods;
            pageData.operationHours = result[1].hotelDetails.hotel.operationHours;

            return Observable.combineLatest(
                Observable.from([pageData]),
                this.eagerCustomersService.getCustomersById(pageData.bookingDO.customerIdList),
                this.getAttachedRoom(pageData.bookingDO),
                this.roomCategoriesStatsService.getRoomCategoryStatsForRoomCategoryId(pageData.bookingDO.roomCategoryId),
                this.getAttachedAllotment(pageData.bookingDO),
                this.invoiceService.getInvoicesForBooking(pageData.bookingDO.id),
                this.eagerAddOnProductsService.getAddOnProductsById(pageData.bookingDO.reservedAddOnProductIdList),
            );
        }).map((result: [BookingOperationsPageData, CustomersDO, RoomVM, RoomCategoryStatsDO, AllotmentDO, InvoiceDO[], AddOnProductsDO]) => {
            var pageData = result[0];
            pageData.customersContainer = result[1];
            pageData.roomVM = result[2];
            pageData.roomCategoryStats = result[3];
            pageData.allotmentDO = result[4];

            let allInvoices = result[5];
            this.setIfHasClosedInvoice(allInvoices, pageData);
            this.setDefaultInvoice(allInvoices, pageData);

            pageData.reservedAddOnProductsContainer = result[6];
            return pageData;
        });
    }

    private getAttachedRoom(bookingDO: BookingDO): Observable<RoomVM> {
        if (this.context.thUtils.isUndefinedOrNull(bookingDO.roomId) || !_.isString(bookingDO.roomId)) {
            return Observable.from([new RoomVM()]);
        }
        return this.roomsService.getRoomById(bookingDO.roomId);
    }
    private getAttachedAllotment(booking: BookingDO): Observable<AllotmentDO> {
        if (!booking.isMadeThroughAllotment()) {
            return Observable.from([new AllotmentDO()]);
        }
        return this.eagerAllotmentsService.getAllotmentById(booking.allotmentId);
    }
    private setIfHasClosedInvoice(allInvoices: InvoiceDO[], pageData: BookingOperationsPageData) {
        let paidInvoices: InvoiceDO[] = _.filter(allInvoices, (invoice: InvoiceDO) => {
            return invoice.isPaid();
        });
        if (paidInvoices.length > 0) {
            pageData.hasClosedInvoice = true;
        }
        else {
            pageData.hasClosedInvoice = false;
        }
    }
    private setDefaultInvoice(allInvoices: InvoiceDO[], pageData: BookingOperationsPageData) {
        let unpaidInvoice: InvoiceDO = _.find(allInvoices, (invoice: InvoiceDO) => {
            return invoice.isUnpaid();
        });
        if (!this.context.thUtils.isUndefinedOrNull(unpaidInvoice)) {
            pageData.invoiceDO = unpaidInvoice;
        }
        else if (allInvoices.length > 0) {
            pageData.invoiceDO = allInvoices[0];
        }
    }
}
