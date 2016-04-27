import {Injectable, ReflectiveInjector} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {AddOnProductsModalComponent} from '../AddOnProductsModalComponent';
import {AddOnProductDO} from '../../../../../../services/add-on-products/data-objects/AddOnProductDO';

@Injectable()
export class AddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openAddOnProductsModal(): Promise<ModalDialogInstance<AddOnProductDO[]>> {
		return this._appContext.modalService.open<any>(<any>AddOnProductsModalComponent, ReflectiveInjector.resolve([]));
	}
}