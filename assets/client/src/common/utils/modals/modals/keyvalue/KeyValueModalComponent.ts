import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseComponent} from '../../../../base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../utils/ICustomModalComponent';
import {ModalDialogRef} from '../../utils/ModalDialogRef';
import {KeyValueModalInput} from './utils/KeyValueModalInput';
import {SharedPipesModule} from '../../../pipes/modules/SharedPipesModule';

@Component({
	selector: 'key-value-modal-component',
	template: `
		<div class="modal-header text-center">
			<h4 class="modal-title">{{ title | translate }}</h4>
		</div>
		<div class="modal-body">
			<div *ngFor="let key of keys">
				<p><b>{{key}}</b>: {{content[key]}}</p>
			</div>
			<hr/>
			<span class="horizontal-align-center">
				<div>
					<button class="btn btn-primary btn-lg" (click)="closeDialog()">
						{{ 'OK' | translate }}
					</button>
				</div>
			</span>
		</div>
	`
})

export class KeyValueModalComponent extends BaseComponent implements ICustomModalComponent {
	title = "";
	content: Object;
	keys: string[];

	constructor(private _modalDialogInstance: ModalDialogRef<any>,
		KeyValueModalInput: KeyValueModalInput) {
		super();
		debugger
		this.title = KeyValueModalInput.title;
		this.content = KeyValueModalInput.content;
		this.keys = Object.keys(this.content);
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}

	public closeDialog() {
		this._modalDialogInstance.closeForced();
	}
}

@NgModule({
    imports: [CommonModule, SharedPipesModule],
    declarations: [KeyValueModalComponent],
    exports: [KeyValueModalComponent]
})
export class KeyValueModalModule { }