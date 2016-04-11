import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {SaveYieldFilterValueDO} from './SaveYieldFilterValueDO';
import {YieldFilterValueActionFactory} from './save-actions/YieldFilterValueActionFactory';
import {YieldFilterConfigurationDO} from '../../../data-layer/hotel-configurations/data-objects/yield-filter/YieldFilterConfigurationDO';
import {YieldFilterValueDO} from '../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterMetaRepoDO} from '../../../data-layer/hotel-configurations/repositories/IYieldFilterConfigurationRepository';

import _ = require("underscore");

export class SaveYieldFilterValue {
    private _thUtils: ThUtils;
    private _yieldFilterValue: SaveYieldFilterValueDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(yieldFilterValueDO: SaveYieldFilterValueDO): Promise<YieldFilterValueDO> {
        this._yieldFilterValue = yieldFilterValueDO;
        return new Promise<YieldFilterValueDO>((resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveYieldFilterValueError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving yield filter value", this._yieldFilterValue, thError);
                reject(thError);
            }
        });
    }
    private saveCore(resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveYieldFilterValueDO.getValidationStructure().validateStructure(this._yieldFilterValue);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._yieldFilterValue);
            parser.logAndReject("Error validating data for save yield filter value", reject);
            return;
        }

        this.saveYieldFilterValue().then((yieldFilterValueDO: YieldFilterValueDO) => {
            resolve(yieldFilterValueDO);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.SaveYieldFilterValueError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving yield filter value", this._yieldFilterValue, thError);
            }
            reject(thError);
        });
    }


    private saveYieldFilterValue(): Promise<YieldFilterValueDO> {
        return new Promise<YieldFilterValueDO>((resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) => {
            this.saveYieldFilterValueCore(resolve, reject);
        });
    }
    private saveYieldFilterValueCore(resolve: { (result: YieldFilterValueDO): void }, reject: { (err: ThError): void }) {
        var actionFactory = new YieldFilterValueActionFactory(this._appContext, this._sessionContext);
        var yieldFilterValueDO = this.buildYieldFilterValueDO();
        var actionStrategy = actionFactory.getActionStrategy({ filterId: this._yieldFilterValue.filterId }, this.buildYieldFilterValueDO());
        actionStrategy.save(resolve, reject);
    }

    private buildYieldFilterValueDO(): YieldFilterValueDO {
        var yieldFilterValue = new YieldFilterValueDO();
        yieldFilterValue.buildFromObject(this._yieldFilterValue);
        return yieldFilterValue;
    }
}