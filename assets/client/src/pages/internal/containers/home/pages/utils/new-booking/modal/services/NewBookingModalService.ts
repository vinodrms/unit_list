import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NewBookingModalComponent} from '../NewBookingModalComponent';
import {NewBookingModalModule} from '../NewBookingModalModule';
import { NewBookingResult } from './utils/NewBookingResult';
import { NewBookingModalInput } from "./utils/NewBookingModalInput";

@Injectable()
export class NewBookingModalService {

	constructor(private _appContext: AppContext) { }

	public openNewBookingModal(newBookingInput?: NewBookingModalInput): Promise<ModalDialogRef<NewBookingResult>> {
		return this._appContext.modalService.open<any>(NewBookingModalModule, NewBookingModalComponent, ReflectiveInjector.resolve([
			{ provide: NewBookingModalInput, useValue: newBookingInput }
		]));
	}
}