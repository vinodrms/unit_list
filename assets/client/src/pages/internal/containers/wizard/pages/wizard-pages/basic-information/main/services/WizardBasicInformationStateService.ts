import {Injectable} from 'angular2/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {WizardStateMeta} from '../../../services/IWizardState';
import {AWizardState} from '../../../services/AWizardState';
import {IBasicInfoStep} from './IBasicInfoStep';
import {WizardBasicInformationController} from './WizardBasicInformationController';
import {WizardBasicInfoIntroService} from '../../pages/intro/services/WizardBasicInfoIntroService';
import {WizardBasicInfoNameAddressService} from '../../pages/name-address/services/WizardBasicInfoNameAddressService';

@Injectable()
export class WizardBasicInformationStateService extends AWizardState {
	private static NavigationBase = "/MainWizardComponent/WizardBasicInformationComponent/";
	private _basicInfoController: WizardBasicInformationController;

	constructor(private _appContext: AppContext,
		introService: WizardBasicInfoIntroService, nameAddressService: WizardBasicInfoNameAddressService) {
		super();
		this._basicInfoController = new WizardBasicInformationController([introService, nameAddressService]);
	}

	public handleNextPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this.handleNextPressedCore(resolve, reject);
		});
	}
	private handleNextPressedCore(resolve: { (result: any): void }, reject: { (err: any): void }) {
		var currentBasicInfoStep: IBasicInfoStep = this._basicInfoController.getCurrentBasicInformationStep();
		currentBasicInfoStep.save().then((result: any) => {
			this.goToNextStep();
			resolve(true);
		}).catch((error: any) => {
			reject(true);
		});
	}
	private goToNextStep() {
		if (this._basicInfoController.isLastBasicInformationStep()) {
			this.wizardController.moveNext();
		}
		else {
			this._basicInfoController.updateBasicInfoStepIndexWithOffset(1);
			this.goToCurrentBasicInfoStep();
		}
	}
	private goToPreviousStep() {
		if (this._basicInfoController.isFirstBasicInformationStep()) {
			return;
		}
		this._basicInfoController.updateBasicInfoStepIndexWithOffset(-1);
		this.goToCurrentBasicInfoStep();
	}
	private goToCurrentBasicInfoStep() {
		var currentBasicInfoStep: IBasicInfoStep = this._basicInfoController.getCurrentBasicInformationStep();
		this._appContext.routerNavigator.navigateTo(WizardBasicInformationStateService.NavigationBase + currentBasicInfoStep.getComponentName());
	}

	public handlePreviousPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this.goToPreviousStep();
			resolve(true);
		});
	}
	public handleSkipPressed(): Promise<any> {
		return this.handlePreviousPressed();
	}

	public canSkip(): boolean {
		return false;
	}
	public hasNext(): boolean {
		return !this._basicInfoController.isLastBasicInformationStep();
	}
	public hasPrevious(): boolean {
		return !this._basicInfoController.isFirstBasicInformationStep();
	}
	public getMeta(): WizardStateMeta {
		return {
			relativeComponentPath: "WizardBasicInformationComponent/WizardBasicInfoIntroComponent",
			iconFontName: "",
			name: "Basic Information"
		};
	}

	public get basicInfoController(): WizardBasicInformationController {
		return this._basicInfoController;
	}
	public set basicInfoController(basicInfoController: WizardBasicInformationController) {
		this._basicInfoController = basicInfoController;
	}
}