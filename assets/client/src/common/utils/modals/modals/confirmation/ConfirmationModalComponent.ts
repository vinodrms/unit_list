import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseComponent} from '../../../../base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../utils/ICustomModalComponent';
import {ModalDialogRef} from '../../utils/ModalDialogRef';
import {ConfirmationModalInput, ConfirmationModalButtons} from './utils/ConfirmationModalInput';
import {TranslationPipe} from '../../../localization/TranslationPipe';

@Component({
	selector: 'loading-modal-component',
	template: `
		<div class="modal-header text-center">
			<h4 class="modal-title">{{ title | translate }}</h4>
		</div>
		<div class="modal-body">
			<p>{{content}}</p>
			<hr/>
			<span style="text-align:center">
				<button *ngIf="buttons.positive" class="btn btn-primary btn-lg" (click)="didConfirm()">
					{{ buttons.positive }}
				</button>
				<button *ngIf="buttons.negative" class="btn btn-danger btn-lg" (click)="didNotConfirm()">
					{{ buttons.negative }}
				</button>
			</span>
		</div>
	`
})

export class ConfirmationModalComponent extends BaseComponent implements ICustomModalComponent {
	title = "";
	content = "";
    buttons: ConfirmationModalButtons;

	constructor(private _modalDialogInstance: ModalDialogRef<any>,
		confirmationModalInput: ConfirmationModalInput) {
		super();
		this.title = confirmationModalInput.title;
		this.content = confirmationModalInput.content;
        this.buttons = confirmationModalInput.buttons;
	}

	public isBlocking(): boolean {
		return true;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}

	public didConfirm() {
		this._modalDialogInstance.addResult(true);
		this._modalDialogInstance.closeForced();
	}
	public didNotConfirm() {
		this._modalDialogInstance.addErrorResult(false);
		this._modalDialogInstance.closeForced();
	}
}

@NgModule({
    imports: [CommonModule],
    declarations: [ConfirmationModalComponent],
    exports: [ConfirmationModalComponent]
})
export class ConfirmationModalModule { }