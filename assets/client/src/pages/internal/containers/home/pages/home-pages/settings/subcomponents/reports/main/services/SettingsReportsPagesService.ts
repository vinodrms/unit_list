import { Injectable } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { SettingsNavbarService } from '../../../navbar/services/SettingsNavbarService';
import { SettingsReportsPageVM } from './utils/SettingsReportsPageVM';
import { ReportGroupType } from "../../utils/ReportGroupType";

import * as _ from "underscore";

@Injectable()
export class SettingsReportsPagesService {
	public static BaseSettingsReportsPath = SettingsNavbarService.BaseSettingsPath + "reports/";
	private _reportsPageList: SettingsReportsPageVM[];

	constructor(private _appContext: AppContext) {
		this._reportsPageList = [
			new SettingsReportsPageVM("shift", ReportGroupType.Shift, "Shift"),
			new SettingsReportsPageVM("backup", ReportGroupType.Backup, "Backup"),
			new SettingsReportsPageVM("guests", ReportGroupType.Guests, "Guests"),
			new SettingsReportsPageVM("key-metrics", ReportGroupType.KeyMetrics, "Key Metrics"),
			new SettingsReportsPageVM("housekeeping", ReportGroupType.Housekeeping, "Housekeeping"),
			new SettingsReportsPageVM("bookings", ReportGroupType.Bookings, "Bookings"),
			new SettingsReportsPageVM("invoices", ReportGroupType.Invoices, "Invoices"),
			new SettingsReportsPageVM("monthly-stats", ReportGroupType.MonthlyStats, "Monthly Stats"),
		];
	}

	public bootstrapSelectedTab(pageType: ReportGroupType) {
		_.forEach(this._reportsPageList, (page: SettingsReportsPageVM) => {
			page.selected = page.pageType === pageType;
		});
	}

	public changePage(reportPage: SettingsReportsPageVM) {
		if (reportPage.selected) {
			return;
		}
		this._appContext.routerNavigator.navigateTo(SettingsReportsPagesService.BaseSettingsReportsPath + reportPage.componentPath);
	}

	public get reportsPageList(): SettingsReportsPageVM[] {
		return this._reportsPageList;
	}

	public set reportsPageList(reportPageList: SettingsReportsPageVM[]) {
		this._reportsPageList = reportPageList;
	}


}