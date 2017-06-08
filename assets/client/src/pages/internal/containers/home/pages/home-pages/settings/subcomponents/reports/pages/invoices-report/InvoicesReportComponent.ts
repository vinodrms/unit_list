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
import { SettingsReportsService } from '../../main/services/SettingsReportsService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { ThHourDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThHourDO';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';

@Component({
	selector: 'invoices-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/invoices-report/template/invoices-report.html',
	providers: [SettingsReportsService]
})
export class InvoicesReportComponent extends BaseComponent {
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private format: ReportOutputFormatType;

	isSaving: boolean = false;
	isLoading: boolean = true;

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.Invoices);
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

	public didSelectEndDate(endDate) {
		this.endDate = endDate;
	}

	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.Invoices,
			format: this.format,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate,
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}

}