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
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/guests-report/template/settings-guests-report.html',
	providers: []
})
export class SettingsGuestsReportComponent extends BaseComponent {
	private format: ReportOutputFormatType;
	private isLoading: boolean = false;
	private startDate: ThDateDO;
	private endDate: ThDateDO;

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _pagesService: SettingsReportsPagesService,
		private _urlBuilderService: SettingsReportsUrlBuilderService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Guests);
	}
	ngOnInit() {
		this.isLoading = true;

		this._hotelService.getHotelDetailsDO()
		.subscribe((details: HotelDetailsDO) => {
			this.startDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this.endDate = this.startDate.buildPrototype();
			this.endDate.addDays(1);
			this.isLoading = false;
		}, (error: ThError) => {
			this.isLoading = false;
			this._appContext.toaster.error(error.message);
		});
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public didSelectStartDate(startDate) {
		this.startDate = startDate;
	}

	public didSelectEndDate(endDate) {
		this.endDate = endDate;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Guests,
			format: this.format,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate,
				
			}
		}

		return this._urlBuilderService.getReportUrl(params);
	}

}