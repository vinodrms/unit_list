import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {ARequestService} from '../../../common/ARequestService';
import {AppContext, ThServerApi} from '../../../../../../common/utils/AppContext';
import {YieldManagerPeriodParam} from '../common/YieldManagerPeriodParam';
import {KeyMetricsResultDO} from './data-objects/KeyMetricsResultDO';
import {KeyMetricsResultItemDO} from './data-objects/result-item/KeyMetricsResultItemDO';
import {KeyMetricDO} from './data-objects/result-item/KeyMetricDO';
import {KeyMetricsResultVM} from './view-models/KeyMetricsResultVM';
import {KeyMetricsResultItemVM} from './view-models/KeyMetricsResultItemVM';
import {KeyMetricVM} from './view-models/key-metric/KeyMetricVM';
import {KeyMetricMetaFactory} from './view-models/key-metric/KeyMetricMetaFactory';

import * as _ from "underscore";

@Injectable()
export class YieldManagerDashboardKeyMetricsService extends ARequestService<KeyMetricsResultVM> {
    private _yieldManagerPeriodParam: YieldManagerPeriodParam;

    constructor(private _appContext: AppContext) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return this._appContext.thHttp.post(ThServerApi.YieldManagerGetKeyMetrics, { yieldParams: this._yieldManagerPeriodParam });
    }

    protected parseResult(result: Object): KeyMetricsResultVM {
        var keyMetricsResultDO = new KeyMetricsResultDO();
        keyMetricsResultDO.buildFromObject(result["keyMetricsResult"]);
        var keyMetricsResultVM = new KeyMetricsResultVM();
        keyMetricsResultVM.currentItemVM = this.convertKeyMetricsResultItemToVM(keyMetricsResultDO.currentItem);
        keyMetricsResultVM.previousItemVM = this.convertKeyMetricsResultItemToVM(keyMetricsResultDO.previousItem);
        return keyMetricsResultVM;
    }
    private convertKeyMetricsResultItemToVM(resultItemDO: KeyMetricsResultItemDO): KeyMetricsResultItemVM {
        var resultItemVM = new KeyMetricsResultItemVM();
        resultItemVM.dateList = resultItemDO.dateList;
        resultItemVM.interval = resultItemDO.interval;
        resultItemVM.metricVMList = [];

        var metricMetaFactory = new KeyMetricMetaFactory();
        _.forEach(resultItemDO.metricList, (keyMetricDO: KeyMetricDO) => {
            var keyMetricVM = new KeyMetricVM();
            keyMetricVM.keyMetricDO = keyMetricDO;
            keyMetricVM.meta = metricMetaFactory.getKeyMetricMetaByType(keyMetricDO.type);
            resultItemVM.metricVMList.push(keyMetricVM);
        });
        return resultItemVM;
    }

    public getKeyMetrics(yieldManagerPeriodParam: YieldManagerPeriodParam): Observable<KeyMetricsResultVM> {
        this._yieldManagerPeriodParam = yieldManagerPeriodParam;
        return this.getServiceObservable();
    }
    public refresh(yieldManagerPeriodParam: YieldManagerPeriodParam) {
        this._yieldManagerPeriodParam = yieldManagerPeriodParam;
        this.updateServiceResult();
    }
}