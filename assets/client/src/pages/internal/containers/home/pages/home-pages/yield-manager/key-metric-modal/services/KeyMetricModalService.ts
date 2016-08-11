import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {KeyMetricModalComponent} from '../KeyMetricModalComponent';
import {KeyMetricModalInput, KeyMetricItem} from './utils/KeyMetricModalInput';
import {KeyMetricsResultVM} from '../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/KeyMetricsResultVM';
import {KeyMetricsResultItemVM} from '../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/KeyMetricsResultItemVM';
import {KeyMetricVM} from '../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/key-metric/KeyMetricVM';
import {KeyMetricType} from '../../../../../../../services/yield-manager/dashboard/key-metrics/data-objects/result-item/KeyMetricType';

@Injectable()
export class KeyMetricModalService {
    constructor(private _appContext: AppContext) { }

    public openKeyMetricModal(keyMetricsResultVM: KeyMetricsResultVM, keyMetricType: KeyMetricType): Promise<ModalDialogRef<boolean>> {
        var modalInput = new KeyMetricModalInput();
        modalInput.currentItem = this.getKeyMetricItem(keyMetricsResultVM.currentItemVM, keyMetricType);
        modalInput.previousItem = this.getKeyMetricItem(keyMetricsResultVM.previousItemVM, keyMetricType);

        return this._appContext.modalService.open<any>(<any>KeyMetricModalComponent, ReflectiveInjector.resolve([
            provide(KeyMetricModalInput, { useValue: modalInput })
        ]));
    }

    private getKeyMetricItem(resultItemVM: KeyMetricsResultItemVM, keyMetricType: KeyMetricType): KeyMetricItem {
        return {
            dateList: resultItemVM.dateList,
            interval: resultItemVM.interval,
            metricVM: _.find(resultItemVM.metricVMList, (metricVM: KeyMetricVM) => {
                return metricVM.keyMetricDO.type === keyMetricType;
            })
        };
    }
}