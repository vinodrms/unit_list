import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ABookingService} from './ABookingService';
import {BookingCartItemVM} from './view-models/BookingCartItemVM';
import {TransientBookingItem} from '../data-objects/TransientBookingItem';
import {BookingDOConstraints} from '../../../../../../../services/bookings/data-objects/BookingDOConstraints';

import * as _ from "underscore";

export interface AddBookingResult {
    success: boolean;
    errorMessage?: string;
}

@Injectable()
export class BookingCartService extends ABookingService {
    private _groupBookingId: string;
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

    public set groupBookingId(groupBookingId: string) {
        this._groupBookingId = groupBookingId;
    }

    public get groupBookingId(): string {
        return this._groupBookingId;
    }
 
    public newBookingsWereAddedToCart(): boolean {
        let newBookingsCounter = 0;

        _.forEach(this._bookingCartItemVMList, (bookingCartItem: BookingCartItemVM) => {
            if(bookingCartItem.isNew()) {
                newBookingsCounter++;
            }
        });

        return newBookingsCounter > 0;
    }

    public getFirstNewBookingFromCart(): BookingCartItemVM {
        let foundBookingCartItemVM: BookingCartItemVM;
        foundBookingCartItemVM = _.find(this._bookingCartItemVMList, (bookingCartItem: BookingCartItemVM) => {
            return bookingCartItem.isNew();
        });

        return foundBookingCartItemVM;
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
        var filteredbookingCartItemVMlist = _.filter(this._bookingCartItemVMList, (bookingItemVM: BookingCartItemVM) => { return bookingItemVM.isNew() });
        return _.map(filteredbookingCartItemVMlist, (bookingItemVM: BookingCartItemVM) => { return bookingItemVM.transientBookingItem });
    }

    public get totalsBookingItem(): BookingCartItemVM {
        return this._totalsBookingItem;
    }
    public set totalsBookingItem(totalsBookingItem: BookingCartItemVM) {
        this._totalsBookingItem = totalsBookingItem;
    }

    public getBookingCartItemByCartSequenceId(cartSequenceId: number): BookingCartItemVM {
        return _.find(this._bookingCartItemVMList, (bookingCartItem: BookingCartItemVM) => { return bookingCartItem.cartSequenceId === cartSequenceId });
    }
}