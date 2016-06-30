import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ABookingService} from './ABookingService';
import {BookingItemVM} from './view-models/BookingItemVM';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';
@Injectable()
export class InMemoryBookingService extends ABookingService {
    constructor() {
        super();
        this._bookingItemVMList = [];
    }

    protected getPageItemList(): Observable<BookingItemVM[]> {
        return this.returnObservableWith(this._bookingItemVMList);
    }

    public addBookingItem(bookingItemVM: BookingItemVM) {
        this._bookingItemVMList.push(bookingItemVM);
        this.refreshData();
    }

    public getTransientBookingItemList(): TransientBookingItem[] {
        return _.map(this._bookingItemVMList, (bookingItemVM: BookingItemVM) => { return bookingItemVM.transientBookingItem });
    }
}