import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../../../../common/base/BaseComponent';
import { AppContext } from '../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { NewBookingResult } from './services/utils/NewBookingResult';
import { NewBookingModalInput } from "./services/utils/NewBookingModalInput";

@Component({
	selector: 'new-booking-modal',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/modal/template/new-booking-modal.html'
})
export class NewBookingModalComponent extends BaseComponent implements ICustomModalComponent {
	constructor(private _modalDialogRef: ModalDialogRef<NewBookingResult>,
		private _appContext: AppContext,
		private _modalInput: NewBookingModalInput) {
		super();
	}
	
	ngOnInit() { }
	
	public closeDialog(closeWithoutConfirmation: boolean) {
		if (closeWithoutConfirmation) {
			this._modalDialogRef.closeForced();
			return;
		}
		var title = this._appContext.thTranslation.translate("Close Wizard");
		var content = this._appContext.thTranslation.translate("Are you sure you want to close the booking wizard?");
		this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
			() => {
				this._modalDialogRef.closeForced();
			}, () => { });
	}

	public didAddBookings(result: boolean) {
		this._modalDialogRef.addResult(new NewBookingResult());
	}

	public isBlocking(): boolean {
		return true;
	}
	public getSize(): ModalSize {
		return ModalSize.XLarge;
	}
	public get newBookingInput(): NewBookingModalInput {
		return this._modalInput;
	}
}