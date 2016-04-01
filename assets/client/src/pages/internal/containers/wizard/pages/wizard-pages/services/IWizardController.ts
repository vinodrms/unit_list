import {IWizardState} from './IWizardState';

export interface IWizardController {
	bootstrapWizardIndex(newIndex);
	moveNext();
	movePrevious();
	moveToState(stateIndex: number);
	getStateList(): IWizardState[];
}