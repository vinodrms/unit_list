import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { Injectable } from '@angular/core';

import * as _ from "underscore";

@Injectable()
export class SettingsReportsUrlBuilderService {

	constructor(private _appContext: AppContext) {
	}

	public getReportUrl(params: Object): string {
        let accessToken = this._appContext.tokenService.accessToken;
        let encodedParams = encodeURI(JSON.stringify(params));
		return `api/reports/report?params=${encodedParams}&token=${accessToken}`;
    }
}