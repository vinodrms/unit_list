import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ABookingService} from './ABookingService';
import {BookingItemVM} from './view-models/BookingItemVM';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';
import {BookingDOConstraints} from '../../../../../../../services/bookings/data-objects/BookingDOConstraints';

export interface AddBookingResult {
    success: boolean;
    errorMessage?: string;
}

@Injectable()
export class BookingCartService extends ABookingService {
    private _cartSequenceId: number = 0;
    private _totalsBookingItem: BookingItemVM;

    constructor(private _appContext: AppContext) {
        super();
        this._bookingItemVMList = [];
    }

    protected getPageItemList(): Observable<BookingItemVM[]> {
        var itemList = this._bookingItemVMList;
        if (!this._appContext.thUtils.isUndefinedOrNull(this.totalsBookingItem)) {
            itemList = itemList.concat(this.totalsBookingItem);
        }
        return this.returnObservableWith(itemList);
    }

    public addBookingItem(bookingItemVM: BookingItemVM): AddBookingResult {
        var addTest = this.testIfcanAddBookingItem(bookingItemVM);
        if (!addTest.success) { return addTest };
        bookingItemVM.cartSequenceId = this.getNextSequenceId();
        this._bookingItemVMList.push(bookingItemVM);
        return { success: true };
    }
    private testIfcanAddBookingItem(bookingItemVM: BookingItemVM): AddBookingResult {
        if (this._bookingItemVMList.length >= BookingDOConstraints.NoBookingsLimit) {
            return {
                success: false,
                errorMessage: this._appContext.thTranslation.translate("You cannot add more that %noBookings% simultaneous bookings", { noBookings: BookingDOConstraints.NoBookingsLimit })
            }
        };
        return { success: true };
    }

    public removeBookingItem(bookingItemVM: BookingItemVM) {
        this._bookingItemVMList = _.filter(this._bookingItemVMList, (item: BookingItemVM) => { return item.cartSequenceId !== bookingItemVM.cartSequenceId });
    }

    private getNextSequenceId(): number {
        var currentCartSequenceId = this._cartSequenceId;
        this._cartSequenceId++;
        return currentCartSequenceId;
    }

    public getTransientBookingItemList(): TransientBookingItem[] {
        return _.map(this._bookingItemVMList, (bookingItemVM: BookingItemVM) => { return bookingItemVM.transientBookingItem });
    }

    public get totalsBookingItem(): BookingItemVM {
        return this._totalsBookingItem;
    }
    public set totalsBookingItem(totalsBookingItem: BookingItemVM) {
        this._totalsBookingItem = totalsBookingItem;
    }
}