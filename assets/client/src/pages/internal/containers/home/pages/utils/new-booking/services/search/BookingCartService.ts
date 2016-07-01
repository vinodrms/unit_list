import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ABookingService} from './ABookingService';
import {BookingCartItemVM} from './view-models/BookingCartItemVM';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';
import {BookingDOConstraints} from '../../../../../../../services/bookings/data-objects/BookingDOConstraints';

export interface AddBookingResult {
    success: boolean;
    errorMessage?: string;
}

@Injectable()
export class BookingCartService extends ABookingService {
    private _cartSequenceId: number = 0;
    private _totalsBookingItem: BookingCartItemVM;

    constructor(private _appContext: AppContext) {
        super();
        this._bookingCartItemVMList = [];
    }

    protected getPageItemList(): Observable<BookingCartItemVM[]> {
        var itemList = this._bookingCartItemVMList;
        if (!this._appContext.thUtils.isUndefinedOrNull(this.totalsBookingItem)) {
            itemList = itemList.concat(this.totalsBookingItem);
        }
        return this.returnObservableWith(itemList);
    }

    public addBookingItem(bookingItemVM: BookingCartItemVM): AddBookingResult {
        var addTest = this.testIfcanAddBookingItem(bookingItemVM);
        if (!addTest.success) { return addTest };
        bookingItemVM.cartSequenceId = this.getNextSequenceId();
        this._bookingCartItemVMList.push(bookingItemVM);
        return { success: true };
    }
    private testIfcanAddBookingItem(bookingItemVM: BookingCartItemVM): AddBookingResult {
        if (this._bookingCartItemVMList.length >= BookingDOConstraints.NoBookingsLimit) {
            return {
                success: false,
                errorMessage: this._appContext.thTranslation.translate("You cannot add more that %noBookings% simultaneous bookings", { noBookings: BookingDOConstraints.NoBookingsLimit })
            }
        };
        return { success: true };
    }

    public removeBookingItem(bookingItemVM: BookingCartItemVM) {
        this._bookingCartItemVMList = _.filter(this._bookingCartItemVMList, (item: BookingCartItemVM) => { return item.cartSequenceId !== bookingItemVM.cartSequenceId });
    }

    private getNextSequenceId(): number {
        var currentCartSequenceId = this._cartSequenceId;
        this._cartSequenceId++;
        return currentCartSequenceId;
    }

    public getTransientBookingItemList(): TransientBookingItem[] {
        return _.map(this._bookingCartItemVMList, (bookingItemVM: BookingCartItemVM) => { return bookingItemVM.transientBookingItem });
    }

    public get totalsBookingItem(): BookingCartItemVM {
        return this._totalsBookingItem;
    }
    public set totalsBookingItem(totalsBookingItem: BookingCartItemVM) {
        this._totalsBookingItem = totalsBookingItem;
    }
}