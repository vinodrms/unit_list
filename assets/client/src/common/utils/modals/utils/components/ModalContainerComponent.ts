import {Component} from 'angular2/core';
import {ModalDialogInstance} from '../ModalDialogInstance';
import {ModalSize} from '../ICustomModalComponent';

@Component({
	selector: 'bootstrap-modal',
	host: {
		'tabindex': '0',
        'role': 'dialog',
        'class': 'in modal',
        'style': 'display: block; position:absolute; ',
		'(click)': 'onClick()'
	},
	template: `
		<div class="modal-dialog" [ngClass]="{'modal-lg': isLarge(), 'modal-sm': isSmall()}">
			<div class="modal-content" (click)="onContainerClick($event)" style="display: block">
				<div style="display: none" #modalDialog>
				</div>
         	</div>
    	</div>
	`
})

export class ModalContainerComponent {
	constructor(private _dialogInstance: ModalDialogInstance) {

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