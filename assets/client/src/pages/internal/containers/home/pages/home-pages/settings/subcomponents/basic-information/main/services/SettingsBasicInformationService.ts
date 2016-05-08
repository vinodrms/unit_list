import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {SettingsNavbarService} from '../../../navbar/services/SettingsNavbarService';
import {SettingsBasicInfoPageVM} from './utils/SettingsBasicInfoPageVM';
import {SettingsBasicInfoPageType} from './utils/SettingsBasicInfoPageType';

@Injectable()
export class SettingsBasicInformationService {
	public static BaseSettingsBasicInfoPath = SettingsNavbarService.BaseSettingsPath + "SettingsBasicInformationComponent/";
	private _basicInfoPageList: SettingsBasicInfoPageVM[];

	constructor(private _appContext: AppContext) {
		this._basicInfoPageList = [
			new SettingsBasicInfoPageVM("SettingsBasicInfoOverviewComponent", SettingsBasicInfoPageType.Overview, "Overview"),
			new SettingsBasicInfoPageVM("SettingsBasicInfoPaymentsAndPoliciesComponent", SettingsBasicInfoPageType.PaymentsAndPolicies, "Payments & Policies"),
			new SettingsBasicInfoPageVM("SettingsBasicInfoPropertyDetailsComponent", SettingsBasicInfoPageType.PropertyDetails, "Property Details")
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