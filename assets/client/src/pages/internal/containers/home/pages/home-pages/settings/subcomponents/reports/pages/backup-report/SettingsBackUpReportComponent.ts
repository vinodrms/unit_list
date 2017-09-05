import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { BasicInfoPaymentsAndPoliciesEditService } from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { HotelService } from '../../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';
import { SettingsReportsUrlBuilderService } from "../../main/services/SettingsReportsUrlBuilderService";

@Component({
	selector: 'settings-backup-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/backup-report/template/settings-backup-report.html',
	providers: []
})
export class SettingsBackUpReportComponent extends BaseComponent {
	private format: ReportOutputFormatType;

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _pagesService: SettingsReportsPagesService,
		private _urlBuilderService: SettingsReportsUrlBuilderService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Backup);
	}
	ngOnInit() {
		
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Backup,
			format: this.format,
			properties: {
			
			}
		}

		return this._urlBuilderService.getReportUrl(params);
	}

}