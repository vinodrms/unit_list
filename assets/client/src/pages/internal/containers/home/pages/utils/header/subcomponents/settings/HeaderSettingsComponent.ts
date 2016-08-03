import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';

@Component({
	selector: 'header-settings',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/settings/template/header-settings.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslationPipe]
})
export class HeaderSettingsComponent extends BaseComponent {
	constructor(private _appContext: AppContext) { 
		super();
	}
	public logOut() {
		this._appContext.logOut();
	}
}