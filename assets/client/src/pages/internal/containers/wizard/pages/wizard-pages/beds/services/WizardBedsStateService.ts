import {Injectable} from 'angular2/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class WizardBedsStateService extends AWizardState {
    private _totalNoOfBeds: number = 0;

    constructor(private _appContext: AppContext) {
        super();
    }

    public handleNextPressed(): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
            if (this._totalNoOfBeds === 0) {
                var title = this._appContext.thTranslation.translate("Skip Beds");
                var content = this._appContext.thTranslation.translate("Before moving to the next section you have to add at least a bed to your inventory.");
                var positiveLabel = this._appContext.thTranslation.translate("OK");
                this.confirmFromModal(resolve, reject, title, content, positiveLabel);
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
            startRelativeComponentPath: "WizardBedsComponent",
            endRelativeComponentPath: "WizardBedsComponent",
            iconFontName: "",
            name: "Beds"
        };
    }

    public get totalNoOfBeds(): number {
        return this._totalNoOfBeds;
    }
    public set totalNoOfBeds(totalNoOfBeds: number) {
        this._totalNoOfBeds = totalNoOfBeds;
    }

    private confirmFromModal(resolve: { (result: any): void }, reject: { (err: any): void }, modalTitle: string, modalContent: string, positiveLabel: string) {
        
        this._appContext.modalService.confirm(modalTitle, modalContent, { positive: positiveLabel },
            () => {
                resolve(false);
            },
            () => {
                resolve(false);
            });
    }
}