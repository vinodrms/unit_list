import {Component} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';

@Component({
	selector: 'header-settings',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/settings/template/header-settings.html',
	directives: [RouterLink],
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