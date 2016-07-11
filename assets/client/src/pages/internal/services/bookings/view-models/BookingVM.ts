import {ThUtils} from '../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {BookingDO} from '../data-objects/BookingDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {CurrencyDO} from '../../common/data-objects/currency/CurrencyDO';

export class BookingVM {
    private _thUtils: ThUtils;

    private _booking: BookingDO;
    private _customerList: CustomerDO[];
    private _ccy: CurrencyDO;

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
}