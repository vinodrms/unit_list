import {Injectable} from 'angular2/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class WizardAddOnProductsStateService extends AWizardState {
    private _totalNoOfAddOnProducts: number = 0;

    constructor(private _appContext: AppContext) {
        super();
    }

    public handleNextPressed(): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
            if (this._totalNoOfAddOnProducts === 0) {
                var title = this._appContext.thTranslation.translate("Skip Add-On Products");
                var content = this._appContext.thTranslation.translate("Are you sure you want to go forward without adding any add on product ?");
                this.confirmFromModalAndGoForward(resolve, reject, title, content);
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
            var title = this._appContext.thTranslation.translate("Skip Add-On Products");
            var content = this._appContext.thTranslation.translate("Are you sure you want to skip adding add on products ?");
            this.confirmFromModalAndGoForward(resolve, reject, title, content);
        });
    }
    private confirmFromModalAndGoForward(resolve: { (result: any): void }, reject: { (err: any): void }, modalTitle: string, modalContent: string) {
        this._appContext.modalService.confirm(modalTitle, modalContent, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.wizardController.moveNext();
                resolve(true);
            },
            () => {
                resolve(false);
            });
    }

    public canSkip(): boolean {
        return true;
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

    public get totalNoOfAddOnProducts(): number {
        return this._totalNoOfAddOnProducts;
    }
    public set totalNoOfAddOnProducts(totalNoOfAddOnProducts: number) {
        this._totalNoOfAddOnProducts = totalNoOfAddOnProducts;
    }
}