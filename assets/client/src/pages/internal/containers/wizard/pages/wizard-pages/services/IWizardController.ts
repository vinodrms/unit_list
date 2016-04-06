import {IWizardState} from './IWizardState';

export interface IWizardController {
	wizardButtonsVisible: boolean;
	bootstrapWizardIndex(newIndex);
	moveNext();
	movePrevious();
	moveToState(stateIndex: number);
	getStateList(): IWizardState[];
}