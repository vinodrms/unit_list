import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
//TOOD:
import {BasicInfoPropertyDetailsEditService} from '../../../../../../../../common/basic-info/property-details/main/services/BasicInfoPropertyDetailsEditService';
import {SettingsReportsPagesService} from '../../main/services/SettingsReportsPagesService';
import {SettingsReportsType} from '../../main/services/utils/SettingsReportsType';

@Component({
	selector: 'settings-backup-report',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/backup-report/template/settings-backup-report.html',
	providers: [BasicInfoPropertyDetailsEditService]
})
export class SettingsBackUpReportComponent extends BaseComponent {
    constructor(private _reportsService: SettingsReportsPagesService,
		private _overviewEditService: BasicInfoPropertyDetailsEditService) {
		super();
		this._reportsService.bootstrap(SettingsReportsType.BackUp);
	}
}