import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';

@Component({
	selector: 'header-settings',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/settings/template/header-settings.html'
})
export class HeaderSettingsComponent extends BaseComponent {
	constructor(private _appContext: AppContext) {
		super();
	}
	public logOut() {
		this._appContext.logOut();
	}
}