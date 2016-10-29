import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {SettingsNavbarService} from '../../../navbar/services/SettingsNavbarService';
import {SettingsReportsPageVM} from './utils/SettingsReportsPageVM';
import {SettingsReportsType} from './utils/SettingsReportsType';

@Injectable()
export class SettingsReportsPagesService {
	public static BaseSettingsReportsPath = SettingsNavbarService.BaseSettingsPath + "reports/";
	private _reportsPageList: SettingsReportsPageVM[];

	constructor(private _appContext: AppContext) {
		this._reportsPageList = [
			new SettingsReportsPageVM("shift", SettingsReportsType.Shift, "Shift"),
			new SettingsReportsPageVM("backup", SettingsReportsType.BackUp, "Backup"),
			new SettingsReportsPageVM("key-metrics", SettingsReportsType.KeyMetrics, "Key Metrics")
		];
	}
	
	public bootstrap(pageType: SettingsReportsType) {
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