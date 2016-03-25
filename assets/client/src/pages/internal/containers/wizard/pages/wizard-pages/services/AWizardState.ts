import {IWizardState, WizardStateMeta} from './IWizardState';
import {IWizardController} from './IWizardController';

export abstract class AWizardState implements IWizardState {
	wizardController: IWizardController;
	stateIndex: number;
	wasVisited: boolean;

	public abstract handleNextPressed(): Promise<any>;
	public abstract handlePreviousPressed(): Promise<any>;
	public abstract handleSkipPressed(): Promise<any>;

	public abstract canSkip(): boolean;
	public abstract hasNext(): boolean;
	public abstract hasPrevious(): boolean;
	public abstract getMeta(): WizardStateMeta;
}