import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {SettingsNavbarService} from '../../../navbar/services/SettingsNavbarService';
import {SettingsBasicInfoPageVM} from './utils/SettingsBasicInfoPageVM';
import {SettingsBasicInfoPageType} from './utils/SettingsBasicInfoPageType';

import * as _ from "underscore";

@Injectable()
export class SettingsBasicInformationService {
	public static BaseSettingsBasicInfoPath = SettingsNavbarService.BaseSettingsPath + "basic-info/";
	private _basicInfoPageList: SettingsBasicInfoPageVM[];

	constructor(private _appContext: AppContext) {
		this._basicInfoPageList = [
			new SettingsBasicInfoPageVM("overview", SettingsBasicInfoPageType.Overview, "Overview"),
			new SettingsBasicInfoPageVM("payments-policies", SettingsBasicInfoPageType.PaymentsAndPolicies, "Payments & Policies"),
			new SettingsBasicInfoPageVM("property-details", SettingsBasicInfoPageType.PropertyDetails, "Property Details")
		];
	}
	public bootstrap(pageType: SettingsBasicInfoPageType) {
		_.forEach(this._basicInfoPageList, (page: SettingsBasicInfoPageVM) => {
			page.selected = page.pageType === pageType;
		});
	}
	public changePage(basicInfoPage: SettingsBasicInfoPageVM) {
		if (basicInfoPage.selected) {
			return;
		}
		this._appContext.routerNavigator.navigateTo(SettingsBasicInformationService.BaseSettingsBasicInfoPath + basicInfoPage.componentPath);
	}

	public get basicInfoPageList(): SettingsBasicInfoPageVM[] {
		return this._basicInfoPageList;
	}
	public set basicInfoPageList(basicInfoPageList: SettingsBasicInfoPageVM[]) {
		this._basicInfoPageList = basicInfoPageList;
	}
}