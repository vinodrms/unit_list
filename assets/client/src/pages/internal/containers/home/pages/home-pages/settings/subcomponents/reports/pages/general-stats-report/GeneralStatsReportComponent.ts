import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { SettingsReportsService } from "../../main/services/SettingsReportsService";
import { HotelService } from "../../../../../../../../../services/hotel/HotelService";
import { SettingsReportsPagesService } from "../../main/services/SettingsReportsPagesService";
import { ReportGroupType } from "../../utils/ReportGroupType";
import { ReportOutputFormatType } from "../../utils/ReportOutputFormatType";
import { ThDateDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateDO";
import { HotelDetailsDO } from "../../../../../../../../../services/hotel/data-objects/HotelDetailsDO";
import { ThDateUtils } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils";
import { ThDateIntervalDO } from "../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO";
import { ThPeriodOption, ThPeriodType } from "../../utils/ThPeriodType";

@Component({
    selector: 'settings-key-metrics-report',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/general-stats-report/template/settings-general-stats-report.html',
    providers: [SettingsReportsService]
})
export class GeneralStatsReportComponent extends BaseComponent {
    private format: ReportOutputFormatType;
	private isLoading: boolean = false;
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private periodOptionList: ThPeriodOption[];
	private selectedPeriodType: ThPeriodType;
    
    constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.GeneralStats);
		this.periodOptionList = ThPeriodOption.getValues();
		this.selectedPeriodType = this.periodOptionList[2].type;
	}
	ngOnInit() {
		this.isLoading = true;

		this._hotelService.getHotelDetailsDO()
		.subscribe((details: HotelDetailsDO) => {
			this.startDate = details.currentThTimestamp.thDateDO.buildPrototype();
			
			let thDateUtils = new ThDateUtils();
			let interval: ThDateIntervalDO = thDateUtils.getPreviousMonthInterval(this.startDate);
			this.startDate = interval.start;
			this.endDate = interval.end;

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
			reportType: ReportGroupType.GeneralStats,
			format: this.format,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate,
				periodType: this.selectedPeriodType,
				
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}

	public didSelectPeriodOption(periodType: string) {
		this.selectedPeriodType = parseInt(periodType);
	}
}