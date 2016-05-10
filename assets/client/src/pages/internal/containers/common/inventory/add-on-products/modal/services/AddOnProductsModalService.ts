import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductsModalComponent} from '../AddOnProductsModalComponent';
import {AddOnProductDO} from '../../../../../../services/add-on-products/data-objects/AddOnProductDO';

@Injectable()
export class AddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openAddOnProductsModal(): Promise<ModalDialogRef<AddOnProductDO[]>> {
		return this._appContext.modalService.open<any>(<any>AddOnProductsModalComponent, ReflectiveInjector.resolve([]));
	}
}