import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {SettingsPageVM} from './utils/SettingsPageVM';
import {SettingsPageType} from './utils/SettingsPageType';

@Injectable()
export class SettingsNavbarService {
	private _numberOfItems: number;
	public static BaseSettingsPath = "/settings/";

	private _settingsPageList: SettingsPageVM[];

	constructor(private _appContext: AppContext) {
		this._numberOfItems = -1;
		this._settingsPageList = [
			new SettingsPageVM(SettingsPageType.BasicInformation, "basic-info", "Basic Information", "8"),
			new SettingsPageVM(SettingsPageType.Beds, "beds", "Beds", "!"),
			new SettingsPageVM(SettingsPageType.Rooms, "rooms", "Rooms", "\""),
			new SettingsPageVM(SettingsPageType.Breakfast, "breakfast", "Breakfast", "#"),
			new SettingsPageVM(SettingsPageType.AddOnProducts, "add-on-products", "Add-On Products", "$"),
			new SettingsPageVM(SettingsPageType.PriceProducts, "price-products", "Price Products", "%"),
			new SettingsPageVM(SettingsPageType.CustomerRegister, "customer-register", "Customer Register", "&"),
			new SettingsPageVM(SettingsPageType.Allotments, "allotments", "Allotments", "â"),
			new SettingsPageVM(SettingsPageType.Reports, "reports", "Reports", "-")
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
		if (!page) {
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