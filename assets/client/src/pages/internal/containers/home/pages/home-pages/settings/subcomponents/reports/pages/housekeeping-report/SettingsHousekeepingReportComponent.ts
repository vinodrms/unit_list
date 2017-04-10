import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { SettingsReportsService } from '../../main/services/SettingsReportsService';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';

@Component({
	selector: 'settings-housekeeping-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/housekeeping-report/template/settings-housekeeping-report.html',
	providers: [SettingsReportsService]
})
export class SettingsHousekeepingReportComponent extends BaseComponent {
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private format: ReportOutputFormatType;

	constructor(
		private _appContext: AppContext,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Housekeeping);
	}
	ngOnInit() {
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Housekeeping,
			format: this.format,
			properties: {
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}
}