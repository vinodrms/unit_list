import {Component} from 'angular2/core';
import {ModalDialogInstance} from '../ModalDialogInstance';
import {ModalSize} from '../ICustomModalComponent';

@Component({
	selector: 'bootstrap-modal',
	host: {
		'tabindex': '0',
        'role': 'dialog',
        'class': 'in modal',
        'style': 'display: block;',
		'(click)': 'onClick()'
	},
	template: `
		<div class="vertical-alignment-helper">
			<div class="modal-dialog vertical-align-center" [ngClass]="{'modal-lg': isLarge(), 'modal-sm': isSmall()}">
				<div class="modal-content" (click)="onContainerClick($event)">
					<div style="display: none" #modalDialog>
					</div>
				</div>
			</div>
		</div>
	`
})

export class ModalContainerComponent<T> {
	constructor(private _dialogInstance: ModalDialogInstance<T>) {

	}

	public isLarge(): boolean {
		return this._dialogInstance.modalSize === ModalSize.Large;
	}
	public isSmall(): boolean {
		return this._dialogInstance.modalSize === ModalSize.Small;
	}

	onContainerClick($event) {
        $event.stopPropagation();
    }

	onClick() {
        return this._dialogInstance.close();
    }
}