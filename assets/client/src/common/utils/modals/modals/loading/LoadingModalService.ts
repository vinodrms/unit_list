import {Injectable, Inject, ReflectiveInjector} from '@angular/core';
import {IModalService} from '../../IModalService';
import {LoadingModalModule} from './LoadingModalComponent';
import {ModalDialogRef} from '../../utils/ModalDialogRef';

@Injectable()
export class LoadingModalService {
	private _dialogRef: ModalDialogRef<any>;

	constructor( @Inject(IModalService) private _modalService: IModalService) {
	}

	public show(completionBlock: { (): void }) {
		if (this._dialogRef) {
			return;
		}
		this._modalService.open(<any>LoadingModalModule, ReflectiveInjector.resolve([]))
			.then((dialogRef: ModalDialogRef<any>) => {
				this._dialogRef = dialogRef;
				completionBlock();
			}).catch((error: any) => {
				this._dialogRef = null;
				completionBlock();
			});
	}
	public hide() {
		if (this._dialogRef) {
			this._dialogRef.closeForced();
			this._dialogRef = null;
		}
	}
}