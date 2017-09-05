import { Injectable } from '@angular/core';
import { IHotelOperationsPageParam } from '../../services/utils/IHotelOperationsPageParam';
import { HotelRoomOperationsPageParam } from '../components/room-operations/utils/HotelRoomOperationsPageParam';
import { HotelBookingOperationsPageParam } from '../components/booking-operations/utils/HotelBookingOperationsPageParam';
import { HotelCustomerOperationsPageParam } from '../components/customer-operations/utils/HotelCustomerOperationsPageParam';
import { HotelInvoiceOperationsPageParam, HotelInvoiceOperationsPageFilterParam } from '../components/invoice-operations/utils/HotelInvoiceOperationsPageParam';
import { HotelInvoiceOperationsDeprecatedPageParam, HotelInvoiceOperationsDeprecatedPageFilterParam } from "../components/invoice-operations-deprecated/utils/HotelInvoiceOperationsDeprecatedPageParam";

@Injectable()
export class HotelOperationsPageControllerService {
    private static MaxPageHistory = 50;

    private _hotelOperationsPageParamList: IHotelOperationsPageParam[];

    constructor() {
    }

    public bootstrap(initialPage: IHotelOperationsPageParam) {
        this._hotelOperationsPageParamList = [initialPage];
    }

    public canGoBack(): boolean {
        return this._hotelOperationsPageParamList.length > 1;
    }
    public goBack() {
        this._hotelOperationsPageParamList.pop();
    }

    public goToRoom(roomId: string) {
        var roomOperationsParam = new HotelRoomOperationsPageParam(roomId);
        this.goToPage(roomOperationsParam);
    }
    public goToBooking(groupBookingId: string, bookingId: string) {
        var bookingOperationsPageParam = new HotelBookingOperationsPageParam(groupBookingId, bookingId);
        this.goToPage(bookingOperationsPageParam);
    }
    public goToCustomer(customerId: string) {
        var custOperationsPageParam = new HotelCustomerOperationsPageParam(customerId);
        this.goToPage(custOperationsPageParam);
    }
    public goToInvoice(invoiceId: string, customerId: string = null) {
        var invoiceOperationsPageParam = new HotelInvoiceOperationsPageParam(invoiceId, {
            customerId: customerId
        });
        this.goToPage(invoiceOperationsPageParam);
    }
    private goToPage(operationsPageParam: IHotelOperationsPageParam) {
        this._hotelOperationsPageParamList.push(operationsPageParam);
        if (this._hotelOperationsPageParamList.length > HotelOperationsPageControllerService.MaxPageHistory) {
            this._hotelOperationsPageParamList.shift();
        }
    }

    public get currentHotelOperationsPageParam(): IHotelOperationsPageParam {
        return this._hotelOperationsPageParamList[this._hotelOperationsPageParamList.length - 1];
    }
}
