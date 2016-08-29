import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {HotelDO} from '../../../../../data-layer/hotel/data-objects/HotelDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {BookingUtils} from '../../../utils/BookingUtils';
import {BookingSearchDependencies} from '../data-loader/results/BookingSearchDependencies';
import {BusinessValidationRuleFilterComposer} from '../../../../common/validation-rule-filters/BusinessValidationRuleFilterComposer';
import {AllotmentConstraintsValidationRule} from '../../../validators/validation-rules/allotment/AllotmentConstraintsValidationRule';
import {AllotmentOpenIntervalValidationRule} from '../../../validators/validation-rules/allotment/AllotmentOpenIntervalValidationRule';
import {PriceProductConstraintsValidationRule} from '../../../validators/validation-rules/price-product/PriceProductConstraintsValidationRule';
import {PriceProductYieldIntervalsValidationRule} from '../../../validators/validation-rules/price-product/PriceProductYieldIntervalsValidationRule';
import {AllotmentDO} from '../../../../../data-layer/allotments/data-objects/AllotmentDO';

export interface BookingDependenciesFilterParams {
    hotel: HotelDO;
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
}

export class BookingDependenciesFilter {
    private _bookingUtils: BookingUtils;
    private _currentThHotelDate: ThDateDO;

    private _searchDependencies: BookingSearchDependencies;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _filterParams: BookingDependenciesFilterParams) {
        this._bookingUtils = new BookingUtils();
        this._currentThHotelDate = this._bookingUtils.getCurrentThDateForHotel(this._filterParams.hotel);
    }
    public filterDependencies(searchDependencies: BookingSearchDependencies): Promise<BookingSearchDependencies> {
        this._searchDependencies = searchDependencies;
        return new Promise<BookingSearchDependencies>((resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void }) => {
            try {
                this.filterDependenciesCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingDependenciesFilterError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error filtering price products & allotments", { _filterParams: this._filterParams, session: this._sessionContext.sessionDO }, thError);
                reject(thError);
            }
        });
    }
    private filterDependenciesCore(resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void }) {
        this._searchDependencies.allotmentList = this.getFilteredAllotments();
        this._searchDependencies.priceProductWithAllotmentList = this.getFilteredPriceProductsWithAllotments();
        this._searchDependencies.priceProductList = this.getFilteredPriceProducts();
        resolve(this._searchDependencies);
    }

    private getFilteredAllotments(): AllotmentDO[] {
        var allotmentFilter = new BusinessValidationRuleFilterComposer([
            new AllotmentConstraintsValidationRule({
                bookingInterval: this._filterParams.interval,
                bookingCreationDate: this._currentThHotelDate
            }),
            new AllotmentOpenIntervalValidationRule({
                bookingInterval: this._filterParams.interval
            })
        ]);
        return allotmentFilter.filterSync(this._searchDependencies.allotmentList);
    }
    private getFilteredPriceProductsWithAllotments() {
        var priceProductWithAllotmentFilter = new BusinessValidationRuleFilterComposer([
            new PriceProductConstraintsValidationRule({
                bookingInterval: this._filterParams.interval,
                bookingCreationDate: this._currentThHotelDate,
                configCapacity: this._filterParams.configCapacity
            })
        ]);
        return priceProductWithAllotmentFilter.filterSync(this._searchDependencies.priceProductWithAllotmentList);
    }
    private getFilteredPriceProducts() {
        var priceProductFilter = new BusinessValidationRuleFilterComposer([
            new PriceProductConstraintsValidationRule({
                bookingInterval: this._filterParams.interval,
                bookingCreationDate: this._currentThHotelDate,
                configCapacity: this._filterParams.configCapacity
            }),
            new PriceProductYieldIntervalsValidationRule(this._filterParams.interval)
        ]);
        return priceProductFilter.filterSync(this._searchDependencies.priceProductList);
    }
}