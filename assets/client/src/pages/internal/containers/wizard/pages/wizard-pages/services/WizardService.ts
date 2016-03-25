import {Injectable} from 'angular2/core';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {IWizardState, WizardStateMeta} from './IWizardState';
import {IWizardController} from './IWizardController';
import {WizardBasicInformationStateService} from '../basic-information/main/services/WizardBasicInformationStateService';
import {WizardBedsStateService} from '../beds/services/WizardBedsStateService';

@Injectable()
export class WizardService implements IWizardState, IWizardController {
	private static NavigationBase = "/MainWizardComponent/";
	
	private _stateList: IWizardState[];
	private _currentState: IWizardState;

	constructor(private _appContext: AppContext,
		basicInfo: WizardBasicInformationStateService, beds: WizardBedsStateService) {
		this._stateList = [basicInfo, beds];
		for (var stateIndex = 0; stateIndex < this._stateList.length; stateIndex++) {
			this._stateList[stateIndex].stateIndex = stateIndex;
			this._stateList[stateIndex].wasVisited = false;
			this._stateList[stateIndex].wizardController = this;
		}
		this._currentState = this._stateList[0];
		this._currentState.wasVisited = true;
	}

	public moveNext() {
		if (this._currentState.stateIndex == this._stateList.length - 1) {
			return;
		}
		this.setCurrentState(this._currentState.stateIndex + 1);
	}
	public movePrevious() {
		if (this._currentState.stateIndex == 0) {
			return;
		}
		this.setCurrentState(this._currentState.stateIndex - 1);
	}
	public moveToState(stateIndex: number) {
		if (this._stateList[stateIndex].wasVisited) {
			this.setCurrentState(stateIndex);
		}
	}
	private setCurrentState(newStateIndex: number) {
		if (newStateIndex !== this.stateIndex) {
			this._currentState = this._stateList[newStateIndex];
			this._currentState.wasVisited = true;
			this._appContext.routerNavigator.navigateTo(WizardService.NavigationBase + this._currentState.getMeta().relativeComponentPath);
		}
	}
	public getStateList(): IWizardState[] {
		return this._stateList;
	}

	public handleNextPressed(): Promise<any> {
		return this._currentState.handleNextPressed();
	}
	public handlePreviousPressed(): Promise<any> {
		return this._currentState.handlePreviousPressed();
	}
	public handleSkipPressed(): Promise<any> {
		return this._currentState.handlePreviousPressed();
	}
	public canSkip(): boolean {
		return this._currentState.canSkip();
	}
	public hasNext(): boolean {
		if (this._currentState.stateIndex === this._stateList.length - 1) {
			return this._currentState.hasNext();
		}
		return true;
	}
	public hasPrevious(): boolean {
		if (this._currentState.stateIndex === 0) {
			return this._currentState.hasPrevious();
		}
		return true;
	}
	public getMeta(): WizardStateMeta {
		return this._currentState.getMeta();
	}

	public get wasVisited(): boolean {
		return this._currentState.wasVisited;
	}
	public set wasVisited(wasVisited: boolean) {
		this._currentState.wasVisited = wasVisited;
	}
	public get stateIndex(): number {
		return this._currentState.stateIndex;
	}
	public set stateIndex(stateIndex: number) {
		this._currentState.stateIndex = stateIndex;
	}
	public get wizardController(): IWizardController {
		return this._currentState.wizardController;
	}
	public set wizardController(wizardController: IWizardController) {
		this._currentState.wizardController = wizardController;
	}
}