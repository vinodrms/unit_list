import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { BasicInfoPaymentsAndPoliciesEditService } from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import { SettingsReportsPagesService } from '../../main/services/SettingsReportsPagesService';
import { ThDateDO } from '../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import { HotelService } from '../../../../../../../../../services/hotel/HotelService';
import { HotelDetailsDO } from '../../../../../../../../../services/hotel/data-objects/HotelDetailsDO';
import { SettingsReportsService } from '../../main/services/SettingsReportsService';
import { ReportGroupType } from '../../utils/ReportGroupType';
import { ThPeriodType, ThPeriodOption } from '../../utils/ThPeriodType';
import { ReportOutputFormatType } from '../../utils/ReportOutputFormatType';
import { CustomerDO } from "../../../../../../../../../services/customers/data-objects/CustomerDO";

import * as _ from "underscore";

export enum CommissionOption {
	INCLUDE,
	EXCLUDE,
	BOTH
}

@Component({
	selector: 'settings-key-metrics-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/key-metrics-report/template/settings-key-metrics-report.html',
	providers: [SettingsReportsService]
})
export class SettingsKeyMetricsReportComponent extends BaseComponent {
	private static MaxCustomers = 10;
	private static CommissionOption = CommissionOption;
	private startDate: ThDateDO;
	private endDate: ThDateDO;
	private isLoading: boolean = true;
	private periodOptionList: ThPeriodOption[];
	private commissionOption: CommissionOption;
	private excludeVat: boolean;
	private selectedPeriodType: ThPeriodType;
	private format: ReportOutputFormatType;
	private filterByCustomers: boolean = false;
	private customerIdList: string[] = [];

	constructor(
		private _appContext: AppContext,
		private _hotelService: HotelService,
		private _backendService: SettingsReportsService,
		private _pagesService: SettingsReportsPagesService) {
		super();
		this._pagesService.bootstrapSelectedTab(ReportGroupType.KeyMetrics);
		this.periodOptionList = ThPeriodOption.getValues();
		this.commissionOption = CommissionOption.EXCLUDE;
		this.excludeVat = true;
		this.selectedPeriodType = this.periodOptionList[0].type;
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
	public didSelectPeriodOption(periodType: string) {
		this.selectedPeriodType = parseInt(periodType);
	}
	public didSelectFormat(format: ReportOutputFormatType) {
		this.format = format;
	}

	public reportCSVUrl(): string {
		let params = {
			reportType: ReportGroupType.KeyMetrics,
			format: this.format,
			properties: {
				startDate: this.startDate,
				endDate: this.endDate,
				periodType: this.selectedPeriodType,
				commissionOption: this.commissionOption,
				excludeVat: this.excludeVat,
			}
		}
		if (this.filterByCustomers && this.customerIdList.length > 0) {
			params.properties["customerIdList"] = this.customerIdList;
		}
		var encodedParams = encodeURI(JSON.stringify(params));
		return 'api/reports/report?params=' + encodedParams;
	}

	public isSelectedCommissionOptionExclude(): boolean {
		return this.commissionOption === CommissionOption.EXCLUDE;
	}

	public isSelectedCommissionOptionInclude(): boolean {
		return this.commissionOption === CommissionOption.INCLUDE;
	}

	public isSelectedCommissionOptionBoth(): boolean {
		return this.commissionOption === CommissionOption.BOTH;
	}

	public setSelectedCommissionOptionExclude() {
		this.commissionOption = CommissionOption.EXCLUDE;
	}

	public setSelectedCommissionOptionInclude() {
		this.commissionOption = CommissionOption.INCLUDE;
	}

	public setSelectedCommissionOptionBoth() {
		this.commissionOption = CommissionOption.BOTH;
	}

	public get maxCustomers(): number {
		return SettingsKeyMetricsReportComponent.MaxCustomers;
	}

	public didAddCustomer(customer: CustomerDO) {
		this.customerIdList.push(customer.id);
		this.customerIdList = _.uniq(this.customerIdList);
	}
	public didRemoveCustomer(customer: CustomerDO) {
		this.customerIdList = _.filter(this.customerIdList, existingId => { return existingId != customer.id; });
	}
}