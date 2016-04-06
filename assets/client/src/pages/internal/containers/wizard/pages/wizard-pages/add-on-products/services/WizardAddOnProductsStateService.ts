import {Injectable} from 'angular2/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';

@Injectable()
export class WizardAddOnProductsStateService extends AWizardState {
	public handleNextPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this.wizardController.moveNext();
			resolve(true);
		});
	}
	public handlePreviousPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			this.wizardController.movePrevious();
			resolve(true);
		});
	}
	public handleSkipPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			resolve(true);
		});
	}

	public canSkip(): boolean {
		return false;
	}
	public hasNext(): boolean {
		return false;
	}
	public hasPrevious(): boolean {
		return false;
	}
	public getMeta(): WizardStateMeta {
		return {
			startRelativeComponentPath: "WizardAddOnProductsComponent",
			endRelativeComponentPath: "WizardAddOnProductsComponent",
			iconFontName: "",
			name: "Add-On Products"
		};
	}
}