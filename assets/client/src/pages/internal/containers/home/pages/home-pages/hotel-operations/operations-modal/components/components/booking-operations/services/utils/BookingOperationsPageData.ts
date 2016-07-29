import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {BookingMeta} from '../../../../../../../../../../../services/bookings/data-objects/BookingMeta';
import {BookingMetaFactory} from '../../../../../../../../../../../services/bookings/data-objects/BookingMetaFactory';
import {CurrencyDO} from '../../../../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {OperationHoursDO} from '../../../../../../../../../../../services/hotel/data-objects/hotel/operation-hours/OperationHoursDO';
import {HotelPaymentMethodsDO} from '../../../../../../../../../../../services/settings/data-objects/HotelPaymentMethodsDO';
import {CustomersDO} from '../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomCategoryStatsDO} from '../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';
import {AllotmentDO} from '../../../../../../../../../../../services/allotments/data-objects/AllotmentDO';

export class BookingOperationsPageData {
    private _bookingDO: BookingDO;
    private _bookingMeta: BookingMeta;
    private _allotmentDO: AllotmentDO;
    private _ccy: CurrencyDO;
    private _operationHours: OperationHoursDO;
    private _allPaymentMethods: HotelPaymentMethodsDO;
    private _allowedPaymentMethods: HotelPaymentMethodsDO;
    private _customersContainer: CustomersDO;
    private _roomVM: RoomVM;
    private _roomCategoryStats: RoomCategoryStatsDO;

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
        return this._allPaymentMethods;
    }
    public set allPaymentMethods(allPaymentMethods: HotelPaymentMethodsDO) {
        this._allPaymentMethods = allPaymentMethods;
    }
    public get allowedPaymentMethods(): HotelPaymentMethodsDO {
        return this._allowedPaymentMethods;
    }
    public set allowedPaymentMethods(allowedPaymentMethods: HotelPaymentMethodsDO) {
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
        return pageData;
    }
}