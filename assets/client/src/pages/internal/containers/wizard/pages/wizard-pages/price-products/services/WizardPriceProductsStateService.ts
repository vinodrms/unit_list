import {Injectable} from '@angular/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class WizardPriceProductsStateService extends AWizardState {
	private _totalNoOfActivePriceProducts: number = 0;

	constructor(private _appContext: AppContext) {
		super();
	}

	public handleNextPressed(): Promise<any> {
		return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
			if (this._totalNoOfActivePriceProducts === 0) {
				var modalTitle = this._appContext.thTranslation.translate("Price Product Required");
				var errorMessage = this._appContext.thTranslation.translate("Please add at least an active Price Product before going forward");
				this._appContext.modalService.confirm(modalTitle, errorMessage, { positive: "Ok" }, () => { }, () => { });
				resolve(false);
				return;
			}
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
			resolve(false);
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
			startRelativeComponentPath: "WizardPriceProductsComponent",
			endRelativeComponentPath: "WizardPriceProductsComponent",
			iconFontName: "%",
			name: "Price Products"
		};
	}

	public get totalNoOfActivePriceProducts(): number {
		return this._totalNoOfActivePriceProducts;
	}
	public set totalNoOfActivePriceProducts(totalNoOfActivePriceProducts: number) {
		this._totalNoOfActivePriceProducts = totalNoOfActivePriceProducts;
	}
}