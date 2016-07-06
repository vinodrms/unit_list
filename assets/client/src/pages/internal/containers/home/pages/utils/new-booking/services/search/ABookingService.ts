import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {BookingCartItemVM} from './view-models/BookingCartItemVM';
import {ASinglePageRequestService} from '../../../../../../../services/common/ASinglePageRequestService';

export abstract class ABookingService extends ASinglePageRequestService<BookingCartItemVM> {
    protected _bookingCartItemVMList: BookingCartItemVM[];

    protected returnEmptyResult(): Observable<BookingCartItemVM[]> {
        return this.returnObservableWith([]);
    }
    protected returnObservableWith(bookingItemVMList: BookingCartItemVM[]): Observable<BookingCartItemVM[]> {
        return new Observable<BookingCartItemVM[]>((serviceObserver: Observer<BookingCartItemVM[]>) => {
            serviceObserver.next(bookingItemVMList);
        });
    }

    public get bookingItemVMList(): BookingCartItemVM[] {
        return this._bookingCartItemVMList;
    }
    public set bookingItemVMList(bookingItemVMList: BookingCartItemVM[]) {
        this._bookingCartItemVMList = bookingItemVMList;
        this.refreshData();
    }
}