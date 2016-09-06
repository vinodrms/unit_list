import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardService} from '../../wizard-pages/services/WizardService';
import {IWizardState, WizardStateMeta} from '../../wizard-pages/services/IWizardState';
import {IWizardController} from '../../wizard-pages/services/IWizardController';

@Component({
	selector: 'wizard-navbar-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/utils/navbar/template/wizard-navbar-component.html'
})
export class WizardNavbarComponent extends BaseComponent {
	wizardStateMetaList: { stateIndex: number, meta: WizardStateMeta }[];

	private _wizardController: IWizardController;
	private _currentWizardState: IWizardState;
	private _wizardStateList: IWizardState[];


	constructor(wizardService: WizardService) {
		super();
		this._wizardController = wizardService;
		this._currentWizardState = wizardService;
		this.initStateDetails();
	}

	private initStateDetails() {
		this._wizardStateList = this._wizardController.getStateList();
		this.wizardStateMetaList = [];
		this._wizardStateList.forEach((state: IWizardState) => {
			this.wizardStateMetaList.push({
				meta: state.getMeta(),
				stateIndex: state.stateIndex
			});
		});
	}
	public moveToState(stateIndex: number) {
		this._wizardController.moveToState(stateIndex);
	}
	public isCurrentState(stateIndex: number) {
		return this._currentWizardState.stateIndex === stateIndex;
	}
	public wasVisited(stateIndex: number) {
		return this._wizardStateList[stateIndex].wasVisited;
	}
}