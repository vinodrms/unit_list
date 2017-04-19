import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../AppContext';
import {ModalDialogRef} from '../../utils/ModalDialogRef';
import {KeyValueModalComponent, KeyValueModalModule} from './KeyValueModalComponent';
import {KeyValueModalInput} from './utils/KeyValueModalInput';

@Injectable()
export class KeyValueModalService {

	constructor(private _appContext: AppContext) { }

	public openModal(title: string, content: Object): Promise<ModalDialogRef<any>> {
		var keyValueModalInput = new KeyValueModalInput();
		keyValueModalInput.title = title;
		keyValueModalInput.content = content;

		return this._appContext.modalService.open<any>(KeyValueModalModule, KeyValueModalComponent, ReflectiveInjector.resolve([
			{ provide: KeyValueModalInput, useValue: keyValueModalInput }
		]));
	}
}