import { Component, OnInit, Input } from '@angular/core';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {IYieldManagerDashboardFilter} from '../../YieldManagerDashboardComponent';
import {YieldManagerDashboardKeyMetricsService} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/YieldManagerDashboardKeyMetricsService';
import {KeyMetricsResultVM} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/KeyMetricsResultVM';
import {KeyMetricVM} from '../../../../../../../../services/yield-manager/dashboard/key-metrics/view-models/key-metric/KeyMetricVM';
import {YieldManagerPeriodParam} from '../../../../../../../../services/yield-manager/dashboard/common/YieldManagerPeriodParam';
import {KeyMetricModalService} from '../../../key-metric-modal/services/KeyMetricModalService';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';

@Component({
	selector: 'yield-key-metrics',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-key-metrics/template/yield-key-metrics.html',
	providers: [YieldManagerDashboardKeyMetricsService, KeyMetricModalService]
})
export class YieldKeyMetricsComponent implements OnInit {
	public matrix: string[][];
	public metricsResults: KeyMetricsResultVM;

	private _yieldManager: IYieldManagerDashboardFilter;

	constructor(
		private _keyMetricsService: YieldManagerDashboardKeyMetricsService,
		private _keyMetricModalService: KeyMetricModalService,
		private _appContext: AppContext
	) {
	}

	public getDateLabel(date: ThDateDO) {
		return date.getLongDayDisplayString(this._appContext.thTranslation).charAt(0) + " "
				+ date.getDayString() + "." + date.getMonthString();
	}

	ngOnInit() {
	}

	public refreshTable(date: ThDateDO, noDays: number) {
		if (this.metricsResults) {
			this._keyMetricsService.refresh({ referenceDate: date, noDays: noDays });
		}
		else {
			this._keyMetricsService.getKeyMetrics({ referenceDate: date, noDays: noDays }).subscribe((results: KeyMetricsResultVM) => {
				this.metricsResults = results;
			}, (e) => {
				console.log(e);
			});
		}
	}

	private normalizeAndReversPercentage(percentage) {
		const PERCENTAGE_MIN = 0;
		const PERCENTAGE_MAX = 1;

		var nrPercentage = PERCENTAGE_MAX - Math.min(Math.max(percentage, PERCENTAGE_MIN), PERCENTAGE_MAX);

		return nrPercentage;
	}

	public getPercentageStyles(percentage): Object {
		const PERCENTAGE_MID = 0.5;
		const PERCENTAGE_MIN = 0;
		const PERCENTAGE_MAX = 1;
		var red, green;

		var rgbStr = "";
		if (percentage < PERCENTAGE_MIN || percentage > PERCENTAGE_MAX) {
			rgbStr = "rgb(0, 255, 0)";
		}
		else if (percentage >= PERCENTAGE_MIN && percentage <= PERCENTAGE_MID) {
			green = Math.round((percentage / PERCENTAGE_MID) * 255);
			rgbStr = "rgb(255," + green + ", 0)"
		}
		else {
			red = Math.round((PERCENTAGE_MAX - ((percentage - PERCENTAGE_MID) / PERCENTAGE_MID)) * 255);
			rgbStr = "rgb(" + red + ", 255, 0)";
		}

		return {
			"border-left-color": rgbStr
		};
	}

	public getInventoryStyles(value): Object {
		if (value.available < 0) {
			return {
				'font-weight': 'bold',
			}
		}
		return {}
	}

	public getInventoryAvailableStyles(value): Object {
		if (value.available < 0) {
			return {
				'color': 'red'
			}
		}
		return {}
	}

	public openKeyMetricModal(keyMetricVM: KeyMetricVM) {
		var keyMetricType = keyMetricVM.keyMetricDO.type;
		this._keyMetricModalService.openKeyMetricModal(this.metricsResults, keyMetricType).then((modalDialogRef: ModalDialogRef<boolean>) => {
			modalDialogRef.resultObservable.subscribe((result: boolean) => {
			}, (err: any) => { });
		}).catch((err: any) => { });
	}

	public get yieldManager(): IYieldManagerDashboardFilter {
		return this._yieldManager;
	}

	public set yieldManager(yieldManager: IYieldManagerDashboardFilter) {
		this._yieldManager = yieldManager;
	}
}