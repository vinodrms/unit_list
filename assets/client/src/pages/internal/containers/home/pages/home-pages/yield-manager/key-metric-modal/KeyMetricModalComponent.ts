import {Component, OnInit} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {ChartComponentSubsetDO} from '../../../../../../../../common/utils/components/chart/data-objects/ChartComponentSubsetDO';
import {ChartComponentDO} from '../../../../../../../../common/utils/components/chart/data-objects/ChartComponentDO';
import {KeyMetricModalInput, KeyMetricItem} from './services/utils/KeyMetricModalInput';
import {IKeyMetricValue} from '../../../../../../services/yield-manager/dashboard/key-metrics/data-objects/metric-value/IKeyMetricValue';
import {ThDateDO} from '../../../../../../services/common/data-objects/th-dates/ThDateDO';

@Component({
    selector: 'key-metric-modal',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/key-metric-modal/template/key-metric-modal.html'
})
export class KeyMetricModalComponent implements ICustomModalComponent, OnInit {
    private static AvgLabel = "Average value for this period";
    private static MinLabel = "Minimum value for this period";
    private static MaxLabel = "Maximum value for this period";

    pageTitle: string = "";
    chartComponentDO: ChartComponentDO;
    didInitChartData: boolean = false;

    constructor(private _appContext: AppContext,
        private _modalDialogRef: ModalDialogRef<boolean>,
        private _modalInput: KeyMetricModalInput) { }

    ngOnInit() {
        this.bootstrapChart();
    }

    public closeDialog() {
        this._modalDialogRef.closeForced();
    }
    public isBlocking(): boolean {
        return false;
    }
    public getSize(): ModalSize {
        return ModalSize.Large;
    }

    private bootstrapChart() {
        var metricMeta = this._modalInput.currentItem.metricVM.meta;
        var keyMetric = this._modalInput.currentItem.metricVM.keyMetricDO;
        this.pageTitle = keyMetric.displayName;
        var chartComponentDO = new ChartComponentDO();
        chartComponentDO.title = this._appContext.thTranslation.translate(keyMetric.displayName);
        chartComponentDO.subtitle = this._appContext.thTranslation.translate(metricMeta.measureUnit);
        chartComponentDO.xAxisLabels = this.getXAxisLabels();
        chartComponentDO.subset1 = this.getChartComponentSubset(this._modalInput.previousItem);
        chartComponentDO.subset2 = this.getChartComponentSubset(this._modalInput.currentItem);
        this.chartComponentDO = chartComponentDO;
        this.didInitChartData = true;
    }
    private getXAxisLabels(): string[] {
        var labelList: string[] = [];
        _.forEach(this._modalInput.currentItem.dateList, (date: ThDateDO) => {
            labelList.push(date.getShortDisplayString(this._appContext.thTranslation, true));
        });
        return labelList;
    }
    private getChartComponentSubset(keyMetricItem: KeyMetricItem): ChartComponentSubsetDO {
        var subset = new ChartComponentSubsetDO();
        subset.name = keyMetricItem.interval.getLongDisplayString(this._appContext.thTranslation);
        subset.avgLabel = this._appContext.thTranslation.translate(KeyMetricModalComponent.AvgLabel);
        subset.minLabel = this._appContext.thTranslation.translate(KeyMetricModalComponent.MinLabel);
        subset.maxLabel = this._appContext.thTranslation.translate(KeyMetricModalComponent.MaxLabel);
        subset.data = this.getDataList(keyMetricItem);
        return subset;
    }
    private getDataList(keyMetricItem: KeyMetricItem): number[] {
        var dataList: number[] = [];
        _.forEach(keyMetricItem.metricVM.keyMetricDO.valueList, (metricValue: IKeyMetricValue) => {
            dataList.push(metricValue.getValue());
        });
        return dataList;
    }
}