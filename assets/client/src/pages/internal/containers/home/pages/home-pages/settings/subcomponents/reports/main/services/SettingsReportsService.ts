import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {SettingsNavbarService} from '../../../navbar/services/SettingsNavbarService';
import {SettingsReportsPageVM} from './utils/SettingsReportsPageVM';
import {SettingsReportsType} from './utils/SettingsReportsType';
import {Observable} from 'rxjs/Observable';

import {ThServerApi} from '../../../../../../../../../../../common/utils/http/ThServerApi';

@Injectable()
export class SettingsReportsService {
	public static BaseSettingsReportsPath = SettingsNavbarService.BaseSettingsPath + "reports/";
	private _reportsPageList: SettingsReportsPageVM[];

	constructor(private _appContext: AppContext) {
	}

	public generate(params: any){
		return this._appContext.thHttp.post(ThServerApi.Report, params).subscribe(() => {
		});
	}
}