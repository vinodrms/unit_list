import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NewBookingContainerComponent} from '../component/container/NewBookingContainerComponent';

@Component({
	selector: 'new-booking-modal',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/modal/template/new-booking-modal.html',
	directives: [NewBookingContainerComponent]
})
export class NewBookingModalComponent extends BaseComponent implements ICustomModalComponent {
	constructor(private _modalDialogRef: ModalDialogRef<any>) {
		super();
	}

	ngOnInit() { }

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.XLarge;
	}
}