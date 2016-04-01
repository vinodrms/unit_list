import {IWizardController} from './IWizardController';

export interface WizardStateMeta {
	name: string;
	startRelativeComponentPath: string;
	endRelativeComponentPath: string;
	iconFontName: string;
}

export interface IWizardState {
	wizardController: IWizardController;
	stateIndex: number;
	wasVisited: boolean;

	handleNextPressed(): Promise<any>;
	handlePreviousPressed(): Promise<any>;
	handleSkipPressed(): Promise<any>;

	canSkip(): boolean;
	hasNext(): boolean;
	hasPrevious(): boolean;
	getMeta(): WizardStateMeta;
}