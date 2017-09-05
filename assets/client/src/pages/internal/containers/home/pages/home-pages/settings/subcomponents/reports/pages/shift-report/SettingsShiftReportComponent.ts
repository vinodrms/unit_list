import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { HotelDO } from '../../../../../../../../../services/hotel/data-objects/hotel/HotelDO';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { HotelService } from '../../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { ThHourDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThHourDO';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';
import { SettingsReportsUrlBuilderService } from "../../main/services/SettingsReportsUrlBuilderService";

@Component({
	selector: 'settings-shift-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/shift-report/template/settings-shift-report.html',
	providers: []
})
export class SettingsShiftReportComponent extends BaseComponent {
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private startTime: ThHourDO;
	private endTime: ThHourDO;
	private format: ReportOutputFormatType;

	isSaving: boolean = false;
	isLoading: boolean = true;

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _pagesService: SettingsReportsPagesService,
		private _urlBuilderService: SettingsReportsUrlBuilderService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Shift);
		this.startTime = ThHourDO.buildThHourDO(0, 0);
		this.endTime = ThHourDO.buildThHourDO(0, 0);
	}

	ngOnInit() {
		this._hotelService.getHotelDetailsDO().subscribe((details: HotelDetailsDO) => {
			this.startDate = details.currentThTimestamp.thDateDO.buildPrototype();
			this.endDate = this.startDate.buildPrototype();
			this.endDate.addDays(1);
			this.isLoading = false;
		}, (error: any) => {
			this._appContext.toaster.error(error.message);
		});
	}

	public didSelectStartDate(startDate) {
		this.startDate = startDate;
	}

	public didChangeStartTime(startTime) {
		this.startTime = startTime;
	}

	public didSelectEndDate(endDate) {
		this.endDate = endDate;
	}

	public didChangeEndTime(endTime) {
		this.endTime = endTime;
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Shift,
			format: this.format,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate,
				startDateTime: this.startTime,
				endDateTime: this.endTime
			}
		}

		return this._urlBuilderService.getReportUrl(params);
	}

}