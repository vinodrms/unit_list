import { ThUtils } from '../../../../../../../../../../../../../common/utils/ThUtils';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { BookingMeta } from '../../../../../../../../../../../services/bookings/data-objects/BookingMeta';
import { BookingMetaFactory } from '../../../../../../../../../../../services/bookings/data-objects/BookingMetaFactory';
import { CurrencyDO } from '../../../../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { OperationHoursDO } from '../../../../../../../../../../../services/hotel/data-objects/hotel/operation-hours/OperationHoursDO';
import { HotelPaymentMethodsDO } from '../../../../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import { CustomersDO } from '../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { RoomVM } from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import { RoomCategoryStatsDO } from '../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import { AllotmentDO } from '../../../../../../../../../../../services/allotments/data-objects/AllotmentDO';
import { AddOnProductsDO } from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import { HotelAggregatedPaymentMethodsDO } from "../../../../../../../../../../../services/settings/data-objects/HotelAggregatedPaymentMethodsDO";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";

export class BookingOperationsPageData {
    private _thUtils: ThUtils;

    private _bookingDO: BookingDO;
    private _bookingMeta: BookingMeta;
    private _allotmentDO: AllotmentDO;
    private _ccy: CurrencyDO;
    private _operationHours: OperationHoursDO;
    private _allAvailablePaymentMethods: HotelPaymentMethodsDO;
    private _allowedPaymentMethods: HotelAggregatedPaymentMethodsDO;
    private _customersContainer: CustomersDO;
    private _roomVM: RoomVM;
    private _roomCategoryStats: RoomCategoryStatsDO;
    private _invoiceDO: InvoiceDO;
    private _reservedAddOnProductsContainer: AddOnProductsDO;
    private _hasClosedInvoice: boolean;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public get bookingDO(): BookingDO {
        return this._bookingDO;
    }
    public set bookingDO(bookingDO: BookingDO) {
        this._bookingDO = bookingDO;
        var bookingMetaFactory = new BookingMetaFactory();
        this._bookingMeta = bookingMetaFactory.getBookingMetaByStatus(this._bookingDO.confirmationStatus);
    }
    public get ccy(): CurrencyDO {
        return this._ccy;
    }
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }
    public get operationHours(): OperationHoursDO {
        return this._operationHours;
    }
    public set operationHours(operationHours: OperationHoursDO) {
        this._operationHours = operationHours;
    }
    public get allPaymentMethods(): HotelPaymentMethodsDO {
        return this._allAvailablePaymentMethods;
    }
    public set allPaymentMethods(allPaymentMethods: HotelPaymentMethodsDO) {
        this._allAvailablePaymentMethods = allPaymentMethods;
    }
    public get allowedPaymentMethods(): HotelAggregatedPaymentMethodsDO {
        return this._allowedPaymentMethods;
    }
    public set allowedPaymentMethods(allowedPaymentMethods: HotelAggregatedPaymentMethodsDO) {
        this._allowedPaymentMethods = allowedPaymentMethods;
    }
    public get customersContainer(): CustomersDO {
        return this._customersContainer;
    }
    public set customersContainer(customersContainer: CustomersDO) {
        this._customersContainer = customersContainer;
    }
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }
    public get roomCategoryStats(): RoomCategoryStatsDO {
        return this._roomCategoryStats;
    }
    public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
        this._roomCategoryStats = roomCategoryStats;
    }
    public get bookingMeta(): BookingMeta {
        return this._bookingMeta;
    }
    public set bookingMeta(bookingMeta: BookingMeta) {
        this._bookingMeta = bookingMeta;
    }
    public get allotmentDO(): AllotmentDO {
        return this._allotmentDO;
    }
    public set allotmentDO(allotmentDO: AllotmentDO) {
        this._allotmentDO = allotmentDO;
    }
    public get invoiceDO(): InvoiceDO {
        return this._invoiceDO;
    }
    public set invoiceDO(invoiceDO: InvoiceDO) {
        this._invoiceDO = invoiceDO;
    }
    public get reservedAddOnProductsContainer(): AddOnProductsDO {
        return this._reservedAddOnProductsContainer;
    }
    public set reservedAddOnProductsContainer(reservedAddOnProductsContainer: AddOnProductsDO) {
        this._reservedAddOnProductsContainer = reservedAddOnProductsContainer;
    }
    public get hasClosedInvoice(): boolean {
        return this._hasClosedInvoice;
    }
    public set hasClosedInvoice(value: boolean) {
        this._hasClosedInvoice = value;
    }

    public get hasInvoice(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.invoiceDO);
    }
    public get hasRoom(): boolean {
        return !this._thUtils.isUndefinedOrNull(this.roomVM) &&
            !this._thUtils.isUndefinedOrNull(this.roomVM.room) &&
            !this._thUtils.isUndefinedOrNull(this.bookingDO.roomId);
    }

    public buildPrototype(): BookingOperationsPageData {
        var pageData = new BookingOperationsPageData();
        pageData.bookingDO = this.bookingDO;
        pageData.allotmentDO = this.allotmentDO;
        pageData.ccy = this.ccy;
        pageData.allPaymentMethods = this.allPaymentMethods;
        pageData.allowedPaymentMethods = this.allowedPaymentMethods;
        pageData.operationHours = this.operationHours;
        pageData.customersContainer = this.customersContainer;
        pageData.roomVM = this.roomVM;
        pageData.roomCategoryStats = this.roomCategoryStats;
        pageData.invoiceDO = this.invoiceDO;
        pageData.reservedAddOnProductsContainer = this.reservedAddOnProductsContainer;
        return pageData;
    }
}
