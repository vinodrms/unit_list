import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NewBookingModalComponent} from '../NewBookingModalComponent';
import {NewBookingResult} from './utils/NewBookingResult';

@Injectable()
export class NewBookingModalService {

	constructor(private _appContext: AppContext) { }

	public openNewBookingModal(): Promise<ModalDialogRef<NewBookingResult>> {
		return this._appContext.modalService.open<any>(<any>NewBookingModalComponent, ReflectiveInjector.resolve([
		]));
	}
}