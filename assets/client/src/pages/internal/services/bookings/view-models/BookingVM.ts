import {ThUtils} from '../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {BookingDO} from '../data-objects/BookingDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {BookingMeta} from '../data-objects/BookingMeta';

export class BookingVM {
    private _thUtils: ThUtils;

    private _booking: BookingDO;
    private _customerList: CustomerDO[];
    private _ccy: CurrencyDO;
    private _roomCategory: RoomCategoryDO;
    private _bookingMeta: BookingMeta;
    
    totalPriceString: string;
    conditionsString: string;
    constraintsString: string;
    customerNameString: string;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public get booking(): BookingDO {
        return this._booking;
    }
    public set booking(booking: BookingDO) {
        this._booking = booking;
    }
    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(customerList: CustomerDO[]) {
        this._customerList = customerList;
    }
    public get ccy(): CurrencyDO {
        return this._ccy;
    }
    public set ccy(ccy: CurrencyDO) {
        this._ccy = ccy;
    }
    public get roomCategory(): RoomCategoryDO {
        return this._roomCategory;
    }
    public set roomCategory(roomCategory: RoomCategoryDO) {
        this._roomCategory = roomCategory;
    }
    public get bookingMeta(): BookingMeta {
        return this._bookingMeta;
    }
    public set bookingMeta(bookingMeta: BookingMeta) {
        this._bookingMeta = bookingMeta;
    }

    public isBilledCustomer(customer: CustomerDO): boolean {
        return customer.id === this.booking.defaultBillingDetails.customerId;
    }
}