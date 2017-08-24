import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { BookingPossiblePriceItemsDO } from './data-objects/BookingPossiblePriceItemsDO';
import { BookingDO } from '../../bookings/data-objects/BookingDO';
import { ThTimestampDO } from '../../common/data-objects/th-dates/ThTimestampDO';
import { InvoicePaymentMethodDO } from '../../invoices/data-objects/payers/InvoicePaymentMethodDO';
import { InvoiceGroupDO } from "../../invoices/data-objects/InvoiceGroupDO";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";

@Injectable()
export class HotelOperationsBookingService {

    constructor(private _appContext: AppContext) {
    }

    public getPossiblePrices(groupBookingId: string, bookingId: string): Observable<BookingPossiblePriceItemsDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.HotelOperationsBookingPossiblePrices,
            parameters: {
                booking: {
                    groupBookingId: groupBookingId,
                    id: bookingId
                }
            }
        }).map((possiblePricesObject: Object) => {
            var possiblePrices = new BookingPossiblePriceItemsDO();
            possiblePrices.buildFromObject(possiblePricesObject);
            return possiblePrices;
        });
    }

    public changeDates(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeDates,
                parameters: {
                    booking: booking
                }
            })
        );
    }
    public changeNoShowTime(booking: BookingDO, noShowTimestamp: ThTimestampDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeNoShowTime,
                parameters: {
                    booking: {
                        groupBookingId: booking.groupBookingId,
                        id: booking.id,
                        noShowTimestamp: noShowTimestamp
                    }
                }
            })
        );
    }

    public changeCapacity(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeCapacity,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public addPaymentGuarantee(booking: BookingDO, billedCustomer: CustomerDO, paymentMethod: InvoicePaymentMethodDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingAddPaymentGuarantee,
                parameters: {
                    booking: {
                        groupBookingId: booking.groupBookingId,
                        id: booking.id,
                        billedCustomerId: billedCustomer.id,
                        paymentMethod: paymentMethod
                    }
                }
            })
        );
    }

    public changeDetails(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeDetails,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public changeGuestOnInvoice(booking: any): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeGuestOnInvoice,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public changeCustomers(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangeCustomers,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public cancel(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingCancel,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public reactivate(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingReactivate,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public reserveAddOnProducts(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingReserveAddOnProducts,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public changePriceProduct(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingChangePriceProduct,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public undoCheckIn(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post({
                serverApi: ThServerApi.HotelOperationsBookingUndoCheckIn,
                parameters: {
                    booking: booking
                }
            })
        );
    }

    public generateInvoice(booking: BookingDO): Observable<InvoiceGroupDO> {
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.HotelOperationsBookingGenerateInvoice,
            parameters: {
                booking: booking
            }
        }).map(invoiceGroupObject => {
            var updatedInvoiceGroupDO = new InvoiceGroupDO();
            updatedInvoiceGroupDO.buildFromObject(invoiceGroupObject["invoiceGroup"]);
            return updatedInvoiceGroupDO;
        });
    }

    private mapToBookingObservable(bookingObjectObservable: Observable<Object>): Observable<BookingDO> {
        return bookingObjectObservable.map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }
}