import { Injectable } from '@angular/core';
import {WizardStateMeta} from '../../services/IWizardState';
import {AWizardState} from '../../services/AWizardState';
import {AppContext} from '../../../../../../../../common/utils/AppContext';

@Injectable()
export class WizardAllotmentsStateService extends AWizardState {
    private _totalNoOfAllotments: number = 0;

    constructor(private _appContext: AppContext) {
        super();
    }

    public handleNextPressed(): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: any): void }) => {
            if (this._totalNoOfAllotments === 0) {
                var title = this._appContext.thTranslation.translate("Skip Allotments");
                var content = this._appContext.thTranslation.translate("Are you sure you want to go forward without adding any allotments ?");
                this.confirmFromModalAndGoForward(resolve, reject, title, content);
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
            var title = this._appContext.thTranslation.translate("Skip Allotments");
            var content = this._appContext.thTranslation.translate("Are you sure you want to skip adding allotments ?");
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
            startRelativeComponentPath: "WizardAllotmentsComponent",
            endRelativeComponentPath: "WizardAllotmentsComponent",
            iconFontName: "â",
            name: "Allotments"
        };
    }

    public get totalNoOfAllotments(): number {
        return this._totalNoOfAllotments;
    }
    public set totalNoOfAllotments(totalNoOfAllotments: number) {
        this._totalNoOfAllotments = totalNoOfAllotments;
    }
}