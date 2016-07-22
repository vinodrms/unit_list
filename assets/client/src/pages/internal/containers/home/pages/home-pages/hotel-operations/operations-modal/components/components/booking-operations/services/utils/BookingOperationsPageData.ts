import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {BookingMeta} from '../../../../../../../../../../../services/bookings/data-objects/BookingMeta';
import {BookingMetaFactory} from '../../../../../../../../../../../services/bookings/data-objects/BookingMetaFactory';
import {CurrencyDO} from '../../../../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {CustomersDO} from '../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomCategoryStatsDO} from '../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

export class BookingOperationsPageData {
    private _bookingDO: BookingDO;
    private _bookingMeta: BookingMeta;
    private _ccy: CurrencyDO;
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
}