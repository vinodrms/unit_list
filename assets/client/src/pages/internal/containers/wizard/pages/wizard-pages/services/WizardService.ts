import {Injectable} from '@angular/core';
import {AppContext, ThServerApi} from '../../../../../../../common/utils/AppContext';
import {IWizardState, WizardStateMeta} from './IWizardState';
import {IWizardController} from './IWizardController';
import {WizardBasicInformationStateService} from '../basic-information/main/services/WizardBasicInformationStateService';
import {WizardBedsStateService} from '../beds/services/WizardBedsStateService';
import {WizardRoomsStateService} from '../rooms/services/WizardRoomsStateService';
import {WizardBreakfastStateService} from '../breakfast/services/WizardBreakfastStateService';
import {WizardAddOnProductsStateService} from '../add-on-products/services/WizardAddOnProductsStateService';
import {WizardPriceProductsStateService} from '../price-products/services/WizardPriceProductsStateService';
import {WizardCustomerRegisterStateService} from '../customer-register/services/WizardCustomerRegisterStateService';

@Injectable()
export class WizardService implements IWizardState, IWizardController {
	private static WizardNavigationBasePath = "/MainWizardComponent/";
	private static HomeNavigationPath = "/MainHomeComponent/";

	private _stateList: IWizardState[];
	private _currentState: IWizardState;
	private _wizardButtonsVisible: boolean = true;

	constructor(private _appContext: AppContext,
		basicInfo: WizardBasicInformationStateService, beds: WizardBedsStateService,
        rooms: WizardRoomsStateService, breakfast: WizardBreakfastStateService, 
        addOnProducts: WizardAddOnProductsStateService, priceProducts: WizardPriceProductsStateService,
		customerRegister: WizardCustomerRegisterStateService) {
		this._stateList = [basicInfo, beds, rooms, breakfast, addOnProducts, priceProducts, customerRegister];
		for (var stateIndex = 0; stateIndex < this._stateList.length; stateIndex++) {
			this._stateList[stateIndex].stateIndex = stateIndex;
			this._stateList[stateIndex].wasVisited = false;
			this._stateList[stateIndex].wizardController = this;
			this.bootstrapWizardIndex(0);
		}
	}
	public bootstrapWizardIndex(currentIndex: number) {
		this._currentState = this._stateList[currentIndex];
		for (var stateIndex = 0; stateIndex <= currentIndex; stateIndex++) {
			this._stateList[stateIndex].wasVisited = true;
		}
		this._wizardButtonsVisible = true;
	}

	public moveNext() {
		if (this._currentState.stateIndex == this._stateList.length - 1) {
			// TODO: decomment next line to mark the configuration as completed
			// this.markConfigurationCompleted();
			this._appContext.routerNavigator.navigateTo(WizardService.HomeNavigationPath);
			return;
		}
		this.setCurrentState(this._currentState.stateIndex + 1, true);
	}
	private markConfigurationCompleted() {
		this._appContext.thHttp.post(ThServerApi.HotelDetailsMarkConfigurationCompleted, {}).subscribe((result: any) => {});
	}
	public movePrevious() {
		if (this._currentState.stateIndex == 0) {
			return;
		}
		this.setCurrentState(this._currentState.stateIndex - 1, false);
	}
	public moveToState(stateIndex: number) {
		if (this._stateList[stateIndex].wasVisited) {
			this.setCurrentState(stateIndex, true);
		}
	}
	private setCurrentState(newStateIndex: number, moveToStart: boolean) {
		if (newStateIndex !== this.stateIndex) {
			this._currentState = this._stateList[newStateIndex];
			this._currentState.wasVisited = true;
			var relativePath = this._currentState.getMeta().endRelativeComponentPath;
			if (moveToStart) {
				relativePath = this._currentState.getMeta().startRelativeComponentPath;
			}
			this._wizardButtonsVisible = true;
			this._appContext.routerNavigator.navigateTo(WizardService.WizardNavigationBasePath + relativePath);
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
		return this._currentState.handleSkipPressed();
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
	public get wizardButtonsVisible(): boolean {
		return this._wizardButtonsVisible;
	}
	public set wizardButtonsVisible(wizardButtonsVisible: boolean) {
		this._wizardButtonsVisible = wizardButtonsVisible;
	}
}