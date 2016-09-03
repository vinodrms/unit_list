import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../AppContext';
import {ModalDialogRef} from '../../utils/ModalDialogRef';
import {ConfirmationModalComponent} from './ConfirmationModalComponent';
import {ConfirmationModalInput} from './utils/ConfirmationModalInput';

@Injectable()
export class ConfirmationModalService {

	constructor(private _appContext: AppContext) { }

	public openModal(title: string, content: string): Promise<ModalDialogRef<any>> {
		var confirmationModalInput = new ConfirmationModalInput();
		confirmationModalInput.title = title;
		confirmationModalInput.content = content;

		return this._appContext.modalService.open<any>(<any>ConfirmationModalComponent, ReflectiveInjector.resolve([
			{ provide: ConfirmationModalInput, useValue: confirmationModalInput }
		]));
	}
}