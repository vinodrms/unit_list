import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { ModalDialogRef } from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { PriceProductDO } from '../../../../../../../../../../../services/price-products/data-objects/PriceProductDO';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { InvoiceItemDO } from '../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO';
import { BookingChangePriceProductRight } from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import { ChangePriceProductModalService } from './components/change-price-product/services/ChangePriceProductModalService';
import { BookingCartItemVM } from '../../../../../../../../utils/new-booking/services/search/view-models/BookingCartItemVM';

@Component({
    selector: 'booking-price-product-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/price-product-view/template/booking-price-product-editor.html',
    providers: [ChangePriceProductModalService]
})
export class BookingPriceProductEditorComponent implements OnInit {
    @Output() onBookingPriceProductChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingPriceProductChanged(updatedBooking: BookingDO) {
        this.onBookingPriceProductChanged.next(updatedBooking);
    }

    private _bookingOperationsPageData: BookingOperationsPageData;
    public get bookingOperationsPageData(): BookingOperationsPageData {
        return this._bookingOperationsPageData;
    }
    @Input()
    public set bookingOperationsPageData(bookingOperationsPageData: BookingOperationsPageData) {
        this._bookingOperationsPageData = bookingOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;

    includedString: string = "";
    conditionsString: string = "";
    constraintsString: string = "";

    constructor(private _appContext: AppContext,
        private _changePriceProductModalService: ChangePriceProductModalService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        if (this.bookingDO.price.hasBreakfast()) {
            this.includedString = this.bookingDO.price.breakfast.meta.getDisplayName(this._appContext.thTranslation)
                + " (" + this._appContext.thTranslation.translate("Included") + ")";
        }
        _.forEach(this.bookingDO.price.includedInvoiceItemList, (invoiceItem: InvoiceItemDO) => {
            if (this.includedString.length > 0) { this.includedString += ", "; }
            var totalPrice: number = invoiceItem.meta.getNumberOfItems() * invoiceItem.meta.getUnitPrice();
            totalPrice = this._appContext.thUtils.roundNumberToTwoDecimals(totalPrice);
            this.includedString += invoiceItem.meta.getNumberOfItems() + "x" + invoiceItem.meta.getDisplayName(this._appContext.thTranslation) +
                " (" + totalPrice + this.currencySymbolString + ")";
        });
        this.conditionsString = this.priceProductDO.conditions.getCancellationConditionsString(this._appContext.thTranslation);
        this.constraintsString = this.priceProductDO.constraints.getBriefValueDisplayString(this._appContext.thTranslation);
    }

    public get canChangePriceProduct(): boolean {
        return this._bookingOperationsPageData.bookingMeta.changePriceProductRight === BookingChangePriceProductRight.Edit;
    }

    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get priceProductDO(): PriceProductDO {
        return this.bookingDO.priceProductSnapshot;
    }
    public get currencySymbolString(): string {
        return this._bookingOperationsPageData.ccy.nativeSymbol;
    }
    public get totalPrice(): number {
        return this.bookingDO.price.totalBookingPrice;
    }
    public get totalRoomPrice(): number {
        return this.bookingDO.price.totalRoomPrice;
    }
    public get totalOtherPrice(): number {
        return this.bookingDO.price.totalOtherPrice;
    }
    public get isPenaltyPrice(): boolean {
        return this.bookingDO.price.isPenalty();
    }
    public get roomCategoryName(): string {
        return this._bookingOperationsPageData.roomCategoryStats.roomCategory.displayName;
    }

    public changePriceProduct() {
        if (!this.canChangePriceProduct) { return; }
        this._changePriceProductModalService.changeBookingPriceProduct(this.bookingDO, this._bookingOperationsPageData.customersContainer)
            .then((modalDialogRef: ModalDialogRef<BookingDO>) => {
                modalDialogRef.resultObservable
                    .subscribe((updatedBooking: BookingDO) => {
                        this.triggerOnBookingPriceProductChanged(updatedBooking);
                    }, (err: any) => {
                    });
            }).catch((err: any) => { });
    }
}