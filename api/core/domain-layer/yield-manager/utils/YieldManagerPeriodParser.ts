import {YieldManagerPeriodDO} from './YieldManagerPeriodDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';

export class YieldManagerPeriodParser {
    private _thDateUtils: ThDateUtils;

    constructor(private _yieldManagerPeriodDO: YieldManagerPeriodDO) {
        this._thDateUtils = new ThDateUtils();
    }

    public isValid(): boolean {
        var validationResult = YieldManagerPeriodDO.getValidationStructure().validateStructure(this._yieldManagerPeriodDO);
        if (!validationResult.isValid()) {
            return false;
        }
        var referenceDate = this.getPreprocessedReferenceThDate();
        if (!referenceDate.isValid()) {
            return false;
        }
        return true;
    }

    public getIndexedInterval(): IndexedBookingInterval {
        var referenceDate = this.getPreprocessedReferenceThDate();
        return this.getIntervalFrom(referenceDate);
    }
    public getPrevYearIndexedInterval(): IndexedBookingInterval {
        var referenceDate = this.getPreprocessedReferenceThDate();
        referenceDate = this._thDateUtils.addYearsToThDateDO(referenceDate, -1);
        return this.getIntervalFrom(referenceDate);
    }
    private getIntervalFrom(referenceDate: ThDateDO): IndexedBookingInterval {
        var intervalEndDate = this._thDateUtils.addDaysToThDateDO(referenceDate, this._yieldManagerPeriodDO.noDays);
        var referenceInterval = ThDateIntervalDO.buildThDateIntervalDO(referenceDate, intervalEndDate);
        return new IndexedBookingInterval(referenceInterval);
    }

    private getPreprocessedReferenceThDate(): ThDateDO {
        var referenceDate = new ThDateDO();
        referenceDate.buildFromObject(this._yieldManagerPeriodDO.referenceDate);
        return referenceDate;
    }
}