import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {SettingsNavbarService} from '../../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../../navbar/services/utils/SettingsPageType';
import {SettingsReportsPageVM} from './services/utils/SettingsReportsPageVM';
import {SettingsReportsPagesService} from './services/SettingsReportsPagesService';

@Component({
	selector: 'settings-reports',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/main/template/settings-reports.html',
	providers: [SettingsReportsPagesService]
})
export class SettingsReportsComponent extends BaseComponent {
	constructor(private _navbarService: SettingsNavbarService,
		private _reportsService: SettingsReportsPagesService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.Reports);
	}

	public get reportsPageList(): SettingsReportsPageVM[] {
		return this._reportsService.reportsPageList;
	}

	public changePage(reportPage: SettingsReportsPageVM) {
		this._reportsService.changePage(reportPage);
	}
}