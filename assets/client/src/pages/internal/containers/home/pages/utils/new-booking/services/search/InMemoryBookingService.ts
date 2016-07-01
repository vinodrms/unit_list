import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ABookingService} from './ABookingService';
import {BookingItemVM} from './view-models/BookingItemVM';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';
@Injectable()
export class InMemoryBookingService extends ABookingService {
    private _cartSequenceId: number = 0;

    constructor() {
        super();
        this._bookingItemVMList = [];
    }

    protected getPageItemList(): Observable<BookingItemVM[]> {
        return this.returnObservableWith(this._bookingItemVMList);
    }

    public addBookingItem(bookingItemVM: BookingItemVM) {
        bookingItemVM.cartSequenceId = this.getNextSequenceId();
        this._bookingItemVMList.push(bookingItemVM);
        this.refreshData();
    }

    public removeBookingItem(bookingItemVM: BookingItemVM) {
        this._bookingItemVMList = _.filter(this._bookingItemVMList, (item: BookingItemVM) => { return item.cartSequenceId !== bookingItemVM.cartSequenceId });
        this.refreshData();
    }

    private getNextSequenceId(): number {
        var currentCartSequenceId = this._cartSequenceId;
        this._cartSequenceId++;
        return currentCartSequenceId;
    }

    public getTransientBookingItemList(): TransientBookingItem[] {
        return _.map(this._bookingItemVMList, (bookingItemVM: BookingItemVM) => { return bookingItemVM.transientBookingItem });
    }
}