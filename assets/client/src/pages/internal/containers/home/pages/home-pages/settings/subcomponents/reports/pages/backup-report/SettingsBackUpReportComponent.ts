import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { BasicInfoPaymentsAndPoliciesEditService } from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { HotelService } from '../../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import { SettingsReportsService } from '../../main/services/SettingsReportsService';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';

@Component({
	selector: 'settings-backup-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/backup-report/template/settings-backup-report.html',
	providers: [SettingsReportsService]
})
export class SettingsBackUpReportComponent extends BaseComponent {
	private format: ReportOutputFormatType;
	private isLoading: boolean = false;
	private date: ThDateDO;

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Backup);
	}
	ngOnInit() {
		this.isLoading = true;

		this._hotelService.getHotelDetailsDO()
		.subscribe((result: HotelDetailsDO) => {
			this.date = result.currentThTimestamp.thDateDO.buildPrototype();
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		});
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public didSelectDate(date) {
		this.date = date;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Backup,
			format: this.format,
			properties: {
				date: this.date
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}

}