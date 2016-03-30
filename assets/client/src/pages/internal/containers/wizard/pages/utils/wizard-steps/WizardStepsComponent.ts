import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardService} from '../../wizard-pages/services/WizardService';
import {IWizardState} from '../../wizard-pages/services/IWizardState';

@Component({
	selector: 'wizard-steps-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/utils/wizard-steps/template/wizard-steps-component.html',
	pipes: [TranslationPipe]
})

export class WizardStepsComponent extends BaseComponent {
	private _currentState: IWizardState;

	isMovingNext: boolean = false;

	constructor(wizardService: WizardService) {
		super();
		this._currentState = wizardService;
	}
	public hasNext(): boolean {
		return this._currentState.hasNext();
	}
	public hasPrevious(): boolean {
		return this._currentState.hasPrevious();
	}
	public canSkip(): boolean {
		return this._currentState.canSkip();
	}

	public handleNextPressed() {
		this.isMovingNext = true;
		this._currentState.handleNextPressed().then((result: any) => {
			this.isMovingNext = false;
		}).catch((error: any) => {
			this.isMovingNext = false;
		});
	}
	public handlePreviousPressed() {
		this._currentState.handlePreviousPressed();
	}
	public handleSkipPressed() {
		this._currentState.handleSkipPressed();
	}
}