import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {BookingItemVM} from './view-models/BookingItemVM';
import {ASinglePageRequestService} from '../../../../../../../services/common/ASinglePageRequestService';

export abstract class ABookingService extends ASinglePageRequestService<BookingItemVM> {
    protected _bookingItemVMList: BookingItemVM[];

    protected returnEmptyResult(): Observable<BookingItemVM[]> {
        return this.returnObservableWith([]);
    }
    protected returnObservableWith(bookingItemVMList: BookingItemVM[]): Observable<BookingItemVM[]> {
        return new Observable<BookingItemVM[]>((serviceObserver: Observer<BookingItemVM[]>) => {
            serviceObserver.next(bookingItemVMList);
        });
    }

    public get bookingItemVMList(): BookingItemVM[] {
        return this._bookingItemVMList;
    }
    public set bookingItemVMList(bookingItemVMList: BookingItemVM[]) {
        this._bookingItemVMList = bookingItemVMList;
        this.refreshData();
    }
}