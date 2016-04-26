import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {ThError, AppContext, ThServerApi} from '../../../../../../../common/utils/AppContext';
import {LoginStatusCode} from '../../../../../../../common/utils/responses/LoginStatusCode';
import {WizardService} from '../../wizard-pages/services/WizardService';
import {IWizardState} from '../../wizard-pages/services/IWizardState';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';

@Component({
	selector: 'wizard-header-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/utils/header/template/wizard-header-component.html',
	pipes: [TranslationPipe]
})

export class WizardHeaderComponent extends BaseComponent {
	private _wizardState: IWizardState;

	numberOfSteps: number = 0;

	constructor(wizardService: WizardService, private _appContext: AppContext) {
		super();
		this.numberOfSteps = wizardService.getStateList().length;
		this._wizardState = wizardService;
	}

	public getStateIndex(): number {
		return this._wizardState.stateIndex + 1;
	}
	public getStateName(): string {
		return this._wizardState.getMeta().name;
	}
	public logOut() {
		this._appContext.logOut();
	}
}