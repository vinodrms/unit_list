import { Component, OnInit } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { BookingCartItemVM } from '../../../../../../../../../../utils/new-booking/services/search/view-models/BookingCartItemVM';
import { BookingDO } from '../../../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { ChangePriceProductModalInput } from './services/utils/ChangePriceProductModalInput';
import { ExistingBookingSearchInput } from '../../../../../../../../../../utils/new-booking/component/subcomponents/booking-search/modules/components/utils/ExistingBookingSearchInput';

@Component({
    selector: 'selector',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/price-product-view/components/change-price-product/template/change-price-product-modal.html'
})
export class ChangePriceProductModalComponent implements ICustomModalComponent, OnInit {
    selectedBookingCartItemVM: BookingCartItemVM;
    isUpdatingPriceProduct: boolean = false;
    bookingSearchInput: ExistingBookingSearchInput;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<BookingDO>,
        private _modalInput: ChangePriceProductModalInput) {
        this.bookingSearchInput = new ExistingBookingSearchInput(_modalInput.booking, _modalInput.customersContainer);
    }

    ngOnInit() { }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Large;
    }

    public get didSelectBookingCartItem(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this.selectedBookingCartItemVM);
    }

    public selectBookingCartItem(bookingCartItemVM: BookingCartItemVM) {
        this.selectedBookingCartItemVM = bookingCartItemVM;
        console.log(bookingCartItemVM);
    }

    public useSelectedBookingCartItem() {
        if (!this.didSelectBookingCartItem) { return; }
        // TODO run the change price product rest api and return the updated booking to the dialog ref
    }
}