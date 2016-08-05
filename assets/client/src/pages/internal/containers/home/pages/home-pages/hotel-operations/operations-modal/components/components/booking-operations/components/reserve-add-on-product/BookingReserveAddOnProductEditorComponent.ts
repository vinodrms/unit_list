import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingReserveAddOnProductRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {AddOnProductDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {AddOnProductsModalService} from '../../../../../../../../../../common/inventory/add-on-products/modal/services/AddOnProductsModalService';

@Component({
    selector: 'booking-reserve-add-on-product',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/reserve-add-on-product/template/booking-reserve-add-on-product.html',
    directives: [EditSaveButtonGroupComponent],
    providers: [AddOnProductsModalService],
    pipes: [TranslationPipe]
})
export class BookingReserveAddOnProductEditorComponent implements OnInit {
    @Output() onAddOnProductsChanged = new EventEmitter<BookingDO>();
    public triggerOnAddOnProductsChanged(updatedBooking: BookingDO) {
        this.onAddOnProductsChanged.next(updatedBooking);
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
    readonly: boolean = true;
    isSaving: boolean = false;

    private _addOnProductsContainerCopy: AddOnProductsDO;
    private _didMakeChanges: boolean = false;

    constructor(private _appContext: AppContext,
        private _addOnProductsModalService: AddOnProductsModalService,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;
    }
    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get addOnProductsContainer(): AddOnProductsDO {
        return this._bookingOperationsPageData.reservedAddOnProductsContainer;
    }
    public get addOnProductList(): AddOnProductDO[] {
        return this.addOnProductsContainer.addOnProductList;
    }
    public get addOnProductListIsEmpty(): boolean {
        return this.addOnProductList.length == 0;
    }

    public get hasAddOnProductEditRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.reserveAddOnProductRight === BookingReserveAddOnProductRight.Edit;
    }

    public startEdit() {
        if (!this.hasAddOnProductEditRight) { return; };
        this._addOnProductsContainerCopy = new AddOnProductsDO();
        this._addOnProductsContainerCopy.addOnProductList = _.map(this.addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct });
        this._didMakeChanges = false;
        this.readonly = false;
    }

    public addAddOnProducts() {
        this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((addOnProductList: AddOnProductDO[]) => {
                this.appendAddOnProductList(addOnProductList);
            });
        }).catch((e: any) => { });
    }
    private appendAddOnProductList(addOnProductList: AddOnProductDO[]) {
        _.forEach(addOnProductList, (addOnProduct: AddOnProductDO) => {
            this._didMakeChanges = true;
            this.addOnProductsContainer.addAddOnProduct(addOnProduct);
        });
    }

    public endEdit() {
        this.readonly = true;
        this._bookingOperationsPageData.reservedAddOnProductsContainer = this._addOnProductsContainerCopy;
    }

    public saveAddOnProducts() {
        if (!this.hasAddOnProductEditRight || !this._didMakeChanges) {
            this.endEdit();
            return;
        }
        this.isSaving = true;
        this._bookingOperationsPageData.bookingDO.reservedAddOnProductIdList = _.map(this.addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id });
        this._hotelOperationsBookingService.reserveAddOnProducts(this._bookingOperationsPageData.bookingDO).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "reserve-add-on-products", "Reserved some Add-On-Products for a booking");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnAddOnProductsChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}