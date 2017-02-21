import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../../common/utils/AppContext';
import { BookingPossiblePriceItemsDO } from './data-objects/BookingPossiblePriceItemsDO';
import { BookingDO } from '../../bookings/data-objects/BookingDO';
import { ThTimestampDO } from '../../common/data-objects/th-dates/ThTimestampDO';
import { InvoicePaymentMethodDO } from '../../invoices/data-objects/payers/InvoicePaymentMethodDO';

@Injectable()
export class HotelOperationsBookingService {

    constructor(private _appContext: AppContext) {
    }

    public getPossiblePrices(groupBookingId: string, bookingId: string): Observable<BookingPossiblePriceItemsDO> {
        return this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingPossiblePrices, {
            bookingReference: {
                groupBookingId: groupBookingId,
                bookingId: bookingId
            }
        }).map((possiblePricesObject: Object) => {
            var possiblePrices = new BookingPossiblePriceItemsDO();
            possiblePrices.buildFromObject(possiblePricesObject);
            return possiblePrices;
        });
    }

    public changeDates(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangeDates, {
                booking: booking
            })
        );
    }
    public changeNoShowTime(booking: BookingDO, noShowTimestamp: ThTimestampDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangeNoShowTime, {
                booking: {
                    groupBookingId: booking.groupBookingId,
                    bookingId: booking.bookingId,
                    noShowTimestamp: noShowTimestamp
                }
            })
        );
    }

    public changeCapacity(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangeCapacity, {
                booking: booking
            })
        );
    }

    public addPaymentGuarantee(booking: BookingDO, paymentMethod: InvoicePaymentMethodDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingAddPaymentGuarantee, {
                booking: {
                    groupBookingId: booking.groupBookingId,
                    bookingId: booking.bookingId,
                    paymentMethod: paymentMethod
                }
            })
        );
    }

    public changeDetails(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangeDetails, {
                booking: booking
            })
        );
    }

    public changeCustomers(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangeCustomers, {
                booking: booking
            })
        );
    }

    public cancel(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingCancel, {
                booking: booking
            })
        );
    }

    public reactivate(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingReactivate, {
                booking: booking
            })
        );
    }

    public reserveAddOnProducts(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingReserveAddOnProducts, {
                booking: booking
            })
        );
    }

    public changePriceProduct(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingChangePriceProduct, {
                booking: booking
            })
        );
    }

    public undoCheckIn(booking: BookingDO): Observable<BookingDO> {
        return this.mapToBookingObservable(
            this._appContext.thHttp.post(ThServerApi.HotelOperationsBookingUndoCheckIn, {
                booking: booking
            })
        );
    }

    private mapToBookingObservable(bookingObjectObservable: Observable<Object>): Observable<BookingDO> {
        return bookingObjectObservable.map((bookingObject: Object) => {
            var bookingDO = new BookingDO();
            bookingDO.buildFromObject(bookingObject["booking"]);
            return bookingDO;
        });
    }
}