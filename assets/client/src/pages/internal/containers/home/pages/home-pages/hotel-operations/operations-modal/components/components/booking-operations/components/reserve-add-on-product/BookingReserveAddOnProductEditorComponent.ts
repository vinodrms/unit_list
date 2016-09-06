import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingReserveAddOnProductRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {AddOnProductDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsDO} from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {AddOnProductItemVMContainer} from './view-model/AddOnProductItemVMContainer';
import {AddOnProductItemVM} from './view-model/AddOnProductItemVM';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {AddOnProductsModalService} from '../../../../../../../../../../common/inventory/add-on-products/modal/services/AddOnProductsModalService';

@Component({
    selector: 'booking-reserve-add-on-product',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/reserve-add-on-product/template/booking-reserve-add-on-product.html',
    providers: [AddOnProductsModalService]
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

    private itemContainer: AddOnProductItemVMContainer;
    private _itemContainerCopy: AddOnProductItemVMContainer;
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
        this.itemContainer = new AddOnProductItemVMContainer(this._bookingOperationsPageData.ccy.nativeSymbol);
        this.itemContainer.initItemList(this._bookingOperationsPageData.reservedAddOnProductsContainer, this._bookingOperationsPageData.bookingDO.reservedAddOnProductIdList);
        this.readonly = true;
        this.isSaving = false;
    }

    public get addOnProductItemVMList(): AddOnProductItemVM[] {
        return this.itemContainer.addOnProductVMList;
    }

    public get addOnProductListIsEmpty(): boolean {
        return this.itemContainer.addOnProductVMList.length == 0;
    }
    public get hasAddOnProductEditRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.reserveAddOnProductRight === BookingReserveAddOnProductRight.Edit;
    }
    public get changeBtnLabel(): string {
        if (this.addOnProductListIsEmpty) { return "Reserve"; }
        return "Change";
    }

    public startEdit() {
        if (!this.hasAddOnProductEditRight) { return; };
        this._itemContainerCopy = this.itemContainer.buildPrototype();
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
            this.itemContainer.addAddOnProduct(addOnProduct);
        });
    }
    public removeAddOnProduct(addOnProduct: AddOnProductDO) {
        this._didMakeChanges = true;
        this.itemContainer.removeAddOnProduct(addOnProduct);
    }

    public endEdit() {
        this.readonly = true;
        this.itemContainer = this._itemContainerCopy;
    }

    public saveAddOnProducts() {
        if (!this.hasAddOnProductEditRight || !this._didMakeChanges) {
            this.endEdit();
            return;
        }
        this.isSaving = true;
        this._bookingOperationsPageData.bookingDO.reservedAddOnProductIdList = this.itemContainer.getAddOnProductIdList();
        this._bookingOperationsPageData.reservedAddOnProductsContainer = new AddOnProductsDO();
        this._bookingOperationsPageData.reservedAddOnProductsContainer.addOnProductList = this.itemContainer.getAddOnProductList();
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