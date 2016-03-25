import {IWizardState} from './IWizardState';

export interface IWizardController {
	moveNext();
	movePrevious();
	moveToState(stateIndex: number);
	getStateList(): IWizardState[];
}