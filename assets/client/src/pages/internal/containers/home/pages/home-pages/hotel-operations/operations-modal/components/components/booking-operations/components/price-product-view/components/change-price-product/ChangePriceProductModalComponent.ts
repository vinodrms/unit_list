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
    }

    public useSelectedBookingCartItem() {
        if (!this.didSelectBookingCartItem || this.isUpdatingPriceProduct) { return; }
        var booking = this.bookingSearchInput.booking;
        var transientBookingItem = this.selectedBookingCartItemVM.transientBookingItem;

        if (!this.needsConfirmation()) {
            this.changeBookingPriceProduct();
            return;
        }
        var confirmationDetails = this.getConfirmationDetails();
        var title = this._appContext.thTranslation.translate(confirmationDetails.title);
        var content = this._appContext.thTranslation.translate(confirmationDetails.message);
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.changeBookingPriceProduct();
            }, () => { });
    }

    private needsConfirmation(): boolean {
        var booking = this.bookingSearchInput.booking;
        var transientBookingItem = this.selectedBookingCartItemVM.transientBookingItem;
        return booking.roomCategoryId !== transientBookingItem.roomCategoryId || booking.priceProductId !== transientBookingItem.priceProductId;
    }
    private getConfirmationDetails(): { title: string, message: string } {
        var booking = this.bookingSearchInput.booking;
        var transientBookingItem = this.selectedBookingCartItemVM.transientBookingItem;

        if (booking.roomCategoryId !== transientBookingItem.roomCategoryId && booking.priceProductId !== transientBookingItem.priceProductId) {
            return {
                title: "Change Price Product and Room Category",
                message: "Are you sure you want to change the Price Product and Room Category from this booking? This will affect the total price."
            }
        }
        if (booking.priceProductId !== transientBookingItem.priceProductId) {
            return {
                title: "Change Price Product",
                message: "Are you sure you want to change the Price Product from this booking? This will affect the total price."
            }
        }
        return {
            title: "Change Room Category",
            message: "Are you sure you want to change the Room Category from this booking? This will affect the total price."
        }
    }


    private changeBookingPriceProduct() {
        console.log(this.selectedBookingCartItemVM);
        // TODO: run change price product REST Api
    }
}