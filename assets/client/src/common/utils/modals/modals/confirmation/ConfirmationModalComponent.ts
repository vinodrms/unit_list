import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../utils/ICustomModalComponent';
import {ModalDialogInstance} from '../../utils/ModalDialogInstance';
import {ConfirmationModalInput} from './utils/ConfirmationModalInput';
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
			<center>
				<button class="btn btn-primary btn-lg" (click)="didConfirm()">
					{{ 'Yes' | translate }}
				</button>
				<button class="btn btn-danger btn-lg" (click)="didNotConfirm()">
					{{ 'No' | translate }}
				</button>
			</center>
		</div>
	`,
	pipes: [TranslationPipe]
})

export class ConfirmationModalComponent extends BaseComponent implements ICustomModalComponent {
	title = "";
	content = "";

	constructor(private _modalDialogInstance: ModalDialogInstance<any>,
		confirmationModalInput: ConfirmationModalInput) {
		super();
		this.title = confirmationModalInput.title;
		this.content = confirmationModalInput.content;
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