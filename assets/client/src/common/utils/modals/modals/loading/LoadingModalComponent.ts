import {Component} from '@angular/core';
import {ICustomModalComponent, ModalSize} from '../../utils/ICustomModalComponent';
import {ModalDialogRef} from '../../utils/ModalDialogRef';

@Component({
	selector: 'loading-modal-component',
	template: `
		<div class="modal-header text-center">
			<img src="/client/static-assets/images/anim.gif" width="164" height="164" alt=""/>
			<hr>
			<h3 class="modal-title"><strong>Unit</strong>Pal</h3>
		</div>
	`
})

export class LoadingModalComponent implements ICustomModalComponent {
	constructor() {
	}
	public isBlocking(): boolean {
		return true;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}
}