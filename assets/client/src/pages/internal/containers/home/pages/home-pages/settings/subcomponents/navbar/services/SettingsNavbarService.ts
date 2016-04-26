import {Injectable} from 'angular2/core';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {SettingsPageVM} from './utils/SettingsPageVM';
import {SettingsPageType} from './utils/SettingsPageType';

@Injectable()
export class SettingsNavbarService {
	public static BaseSettingsPath = "/MainHomeComponent/SettingsContainerComponent/";

	private _settingsPageList: SettingsPageVM[];

	constructor(private _appContext: AppContext) {
		this._settingsPageList = [
			new SettingsPageVM(SettingsPageType.BasicInformation, "SettingsBasicInformationComponent", "Basic Information", "8"),
			new SettingsPageVM(SettingsPageType.Beds, "SettingsBedsComponent", "Beds", "!"),
			
		]
	}

	public bootstrap(pageType: SettingsPageType) {
		_.forEach(this._settingsPageList, (page: SettingsPageVM) => {
			page.selected = page.pageType === pageType;
		});
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
}