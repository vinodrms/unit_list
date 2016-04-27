import {Injectable, Inject, ReflectiveInjector} from 'angular2/core';
import {IModalService} from '../../IModalService';
import {LoadingModalComponent} from './LoadingModalComponent';
import {ModalDialogInstance} from '../../utils/ModalDialogInstance';

@Injectable()
export class LoadingModalService {
	private _dialogInstance: ModalDialogInstance<any>;

	constructor( @Inject(IModalService) private _modalService: IModalService) {
	}

	public show(completionBlock: { (): void }) {
		if (this._dialogInstance) {
			return;
		}
		this._modalService.open(<any>LoadingModalComponent, ReflectiveInjector.resolve([]))
			.then((dialogInstance: ModalDialogInstance<any>) => {
				this._dialogInstance = dialogInstance;
				completionBlock();
			}).catch((error: any) => {
				this._dialogInstance = null;
				completionBlock();
			});
	}
	public hide() {
		if (this._dialogInstance) {
			this._dialogInstance.closeForced();
			this._dialogInstance = null;
		}
	}
}