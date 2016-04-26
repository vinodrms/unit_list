import {Injectable} from 'angular2/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {SettingsPageVM} from './utils/SettingsPageVM';
import {SettingsPageType} from './utils/SettingsPageType';

@Injectable()
export class SettingsNavbarService {
	private _numberOfItems: number;
	public static BaseSettingsPath = "/MainHomeComponent/SettingsContainerComponent/";

	private _settingsPageList: SettingsPageVM[];

	constructor(private _appContext: AppContext) {
		this._numberOfItems = -1;
		this._settingsPageList = [
			new SettingsPageVM(SettingsPageType.BasicInformation, "SettingsBasicInformationComponent", "Basic Information", "8"),
			new SettingsPageVM(SettingsPageType.Beds, "SettingsBedsComponent", "Beds", "!"),
			new SettingsPageVM(SettingsPageType.Rooms, "SettingsRoomsComponent", "Rooms", "\""),
			new SettingsPageVM(SettingsPageType.AddOnProducts, "SettingsAddOnProductsComponent", "Add-On Products", "$"),
			new SettingsPageVM(SettingsPageType.PriceProducts, "SettingsPriceProductsComponent", "Price Products", "%"),
			new SettingsPageVM(SettingsPageType.CustomerRegister, "SettingsCustomerRegisterComponent", "Customer Register", "&")
		]
	}

	public bootstrap(pageType: SettingsPageType) {
		_.forEach(this._settingsPageList, (page: SettingsPageVM) => {
			page.selected = page.pageType === pageType;
		});
		this._numberOfItems = -1;
	}

	public get settingsPageList(): SettingsPageVM[] {
		return this._settingsPageList;
	}
	public set settingsPageList(settingsPageList: SettingsPageVM[]) {
		this._settingsPageList = settingsPageList;
	}

	public changePage(settingsPage: SettingsPageVM) {
		if (settingsPage.selected) {
			return;
		}
		this._appContext.routerNavigator.navigateTo(SettingsNavbarService.BaseSettingsPath + settingsPage.componentPath);
	}

	public getSelectedPage(): SettingsPageVM {
		var page: SettingsPageVM = _.find(this._settingsPageList, (page: SettingsPageVM) => {
			return page.selected === true;
		});
		if(!page) {
			page = this._settingsPageList[0];
		}
		return page;
	}
	
	public get numberOfItems(): number {
		return this._numberOfItems;
	}
	public set numberOfItems(numberOfItems: number) {
		this._numberOfItems = numberOfItems;
	}
}