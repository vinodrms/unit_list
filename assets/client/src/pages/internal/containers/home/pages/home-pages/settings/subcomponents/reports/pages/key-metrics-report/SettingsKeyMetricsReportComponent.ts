import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {BasicInfoPaymentsAndPoliciesEditService} from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import {SettingsReportsPagesService} from '../../main/services/SettingsReportsPagesService';
import {SettingsReportsType} from '../../main/services/utils/SettingsReportsType';

@Component({
	selector: 'settings-key-metrics-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/key-metrics-report/template/settings-key-metrics-report.html',
	providers: [BasicInfoPaymentsAndPoliciesEditService]
})
export class SettingsKeyMetricsReportComponent extends BaseComponent {
    constructor(private _reportsService: SettingsReportsPagesService,
		private _overviewEditService: BasicInfoPaymentsAndPoliciesEditService) {
		super();
		this._reportsService.bootstrap(SettingsReportsType.KeyMetrics);
	}
}