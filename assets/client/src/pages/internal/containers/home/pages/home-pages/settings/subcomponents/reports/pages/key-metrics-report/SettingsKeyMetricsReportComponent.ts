import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import {BasicInfoPaymentsAndPoliciesEditService} from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import {SettingsReportsPagesService} from '../../main/services/SettingsReportsPagesService';
import {SettingsReportsType} from '../../main/services/utils/SettingsReportsType';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { HotelService } from '../../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../../services/hotel/data-objects/HotelDetailsDO';

import { SettingsReportsService } from '../../main/services/SettingsReportsService';

@Component({
	selector: 'settings-key-metrics-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/key-metrics-report/template/settings-key-metrics-report.html',
	providers: [SettingsReportsService]
})
export class SettingsKeyMetricsReportComponent extends BaseComponent {
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private isLoading: boolean = true;

    constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrap(SettingsReportsType.KeyMetrics);
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

	public reportCSVUrl(): string {
		let params = {
			//TODO: Report Type
			reportType: 1,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate
			}
		}

		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}
	
}