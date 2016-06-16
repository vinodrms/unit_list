import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import {ThDateIntervalUtils} from '../../../utils/th-dates/ThDateIntervalUtils';

export class YieldIntervalsValidator {
    private _indexedBookingInterval: IndexedBookingInterval;

    private _openIntervalUtils: ThDateIntervalUtils;
    private _openForArrivalIntervalUtils: ThDateIntervalUtils;
    private _openForDepartureIntervalUtils: ThDateIntervalUtils;

    constructor(private _priceProduct: PriceProductDO, bookingInterval: ThDateIntervalDO) {
        this._indexedBookingInterval = new IndexedBookingInterval(bookingInterval);

        this._openIntervalUtils = new ThDateIntervalUtils(_priceProduct.openIntervalList);
        this._openForArrivalIntervalUtils = new ThDateIntervalUtils(_priceProduct.openForArrivalIntervalList);
        this._openForDepartureIntervalUtils = new ThDateIntervalUtils(_priceProduct.openForDepartureIntervalList);
    }

    public isOpenOnAllYieldAttributes(): boolean {
        return this.isOpen() && this.isOpenForArrival() && this.isOpenForDeparture();
    }

    public isOpen(): boolean {
        return this._openIntervalUtils.containsThDateIntervalDO(this._indexedBookingInterval.indexedBookingInterval);
    }

    public isOpenForArrival(): boolean {
        return this._openForArrivalIntervalUtils.containsThDateDO(this._indexedBookingInterval.getArrivalDate());
    }
    public isOpenForDeparture(): boolean {
        return this._openForDepartureIntervalUtils.containsThDateDO(this._indexedBookingInterval.getDepartureDate());
    }
}