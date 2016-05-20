import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';

@Component({
	selector: 'notifications-modal',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/notifications/modal/template/notifications-modal.html',
	pipes: [TranslationPipe]
})
export class NotificationsModalComponent extends BaseComponent implements ICustomModalComponent {
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