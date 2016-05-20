import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalDialogRef} from '../ModalDialogRef';
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
			<div class="modal-dialog vertical-align-center" [ngClass]="{'modal-lg': isLarge(), 'modal-sm': isSmall(), 'modal-xlg': isExtraLarge()}">
				<div class="modal-content" (click)="onContainerClick($event)">
					<div style="display: none" #modalDialog>
					</div>
				</div>
			</div>
		</div>
	`
})

export class ModalContainerComponent<T> {
	@ViewChild('modalDialog', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

	constructor(private _dialogInstance: ModalDialogRef<T>) {

	}

	public isLarge(): boolean {
		return this._dialogInstance.modalSize === ModalSize.Large;
	}
	public isSmall(): boolean {
		return this._dialogInstance.modalSize === ModalSize.Small;
	}
	public isExtraLarge(): boolean {
		return this._dialogInstance.modalSize === ModalSize.XLarge;
	}

	onContainerClick($event) {
        $event.stopPropagation();
    }

	onClick() {
        return this._dialogInstance.close();
    }
}