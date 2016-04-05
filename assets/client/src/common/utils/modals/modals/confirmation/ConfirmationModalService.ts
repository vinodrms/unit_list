import {Injectable, Injector, provide} from 'angular2/core';
import {AppContext} from '../../../AppContext';
import {ModalDialogInstance} from '../../utils/ModalDialogInstance';
import {ConfirmationModalComponent} from './ConfirmationModalComponent';
import {ConfirmationModalInput} from './utils/ConfirmationModalInput';

@Injectable()
export class ConfirmationModalService {

	constructor(private _appContext: AppContext) { }

	public openModal(title: string, content: string): Promise<ModalDialogInstance<any>> {
		var confirmationModalInput = new ConfirmationModalInput();
		confirmationModalInput.title = title;
		confirmationModalInput.content = content;

		return this._appContext.modalService.open<any>(<any>ConfirmationModalComponent, Injector.resolve([
			provide(ConfirmationModalInput, { useValue: confirmationModalInput })
		]));
	}
}