import { Injectable } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { SettingsNavbarService } from '../../../navbar/services/SettingsNavbarService';
import { SettingsIntegrationsPageVM } from './utils/SettingsIntegrationsPageVM';
import { IntegrationType } from "../../utils/IntegrationType";

import * as _ from "underscore";

@Injectable()
export class SettingsIntegrationsPagesService {
	public static BaseSettingsIntegrationsPath = SettingsNavbarService.BaseSettingsPath + "integrations/";
	private _integrationsPageList: SettingsIntegrationsPageVM[];

	constructor(private _appContext: AppContext) {
		this._integrationsPageList = [
			new SettingsIntegrationsPageVM("bookingdotcom", IntegrationType.BookingDotCom, "Booking.com"),
		];
	}

	public bootstrapSelectedTab(pageType: IntegrationType) {
		_.forEach(this._integrationsPageList, (page: SettingsIntegrationsPageVM) => {
			page.selected = page.pageType === pageType;
		});
	}

	public changePage(IntegrationPage: SettingsIntegrationsPageVM) {
		if (IntegrationPage.selected) {
			return;
		}
		this._appContext.routerNavigator.navigateTo(SettingsIntegrationsPagesService.BaseSettingsIntegrationsPath + IntegrationPage.componentPath);
	}

	public get integrationsPageList(): SettingsIntegrationsPageVM[] {
		return this._integrationsPageList;
	}

	public set integrationsPageList(IntegrationPageList: SettingsIntegrationsPageVM[]) {
		this._integrationsPageList = IntegrationPageList;
	}


}