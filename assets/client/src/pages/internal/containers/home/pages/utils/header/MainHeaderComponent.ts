import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router-deprecated';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {LoginStatusCode} from '../../../../../../../common/utils/responses/LoginStatusCode';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';

@Component({
	selector: 'main-header',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/template/main-header.html',
	directives: [RouterLink],
	pipes: [TranslationPipe]
})

export class MainHeaderComponent extends BaseComponent {
	constructor(private _appContext: AppContext) {
		super();
	}

	public logOut() {
		this._appContext.logOut();
	}
}