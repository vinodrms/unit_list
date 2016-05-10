import {Injectable} from '@angular/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class WizardBreakfastStateService extends AWizardState {
    private _totalNoOfBreakfasts: number = 0;

    constructor(private _appContext: AppContext) {
        super();
    }

    public handleNextPressed(): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
            if (this._totalNoOfBreakfasts === 0) {
                var title = this._appContext.thTranslation.translate("Skip Breakfast");
                var content = this._appContext.thTranslation.translate("Are you sure you want to go forward without adding a Breakfast ?");
                var positiveLabel = this._appContext.thTranslation.translate("Yes");
                var negativeLabel = this._appContext.thTranslation.translate("No");
                this.confirmFromModalAndGoForward(resolve, reject, title, content, positiveLabel, negativeLabel);
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
            var title = this._appContext.thTranslation.translate("Skip Breakfast");
            var content = this._appContext.thTranslation.translate("Are you sure you want to skip adding a breakfast ?");
            var positiveLabel = this._appContext.thTranslation.translate("Yes");
            var negativeLabel = this._appContext.thTranslation.translate("No");
            this.confirmFromModalAndGoForward(resolve, reject, title, content, positiveLabel, negativeLabel);
        });
    }
    
    private confirmFromModalAndGoForward(resolve: { (result: any): void }, reject: { (err: any): void }, modalTitle: string, modalContent: string, positiveLabel: string, negativeLabel: string) {
        this._appContext.modalService.confirm(modalTitle, modalContent, { positive: positiveLabel, negative: negativeLabel },
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
            startRelativeComponentPath: "WizardBreakfastComponent",
            endRelativeComponentPath: "WizardBreakfastComponent",
            iconFontName: "#",
            name: "Breakfast"
        };
    }

    public get totalNoOfBreakfasts(): number {
        return this._totalNoOfBreakfasts;
    }
    public set totalNoOfBreakfasts(totalNoOfBreakfasts: number) {
        this._totalNoOfBreakfasts = totalNoOfBreakfasts;
    }
}