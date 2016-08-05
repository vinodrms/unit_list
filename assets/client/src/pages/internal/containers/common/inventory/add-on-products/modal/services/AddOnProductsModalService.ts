import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductsModalComponent} from '../AddOnProductsModalComponent';
import {AddOnProductDO} from '../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsModalInput} from './utils/AddOnProductsModalInput';

@Injectable()
export class AddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openAddOnProductsModal(): Promise<ModalDialogRef<AddOnProductDO[]>> {
		return this.openModal(false, true);
	}
	public openBreakfastModal(): Promise<ModalDialogRef<AddOnProductDO[]>> {
		return this.openModal(true, false);
	}
	private openModal(filterBreakfast: boolean, multiSelection: boolean) {
		var modalInput = new AddOnProductsModalInput();
		modalInput.filterBreakfast = filterBreakfast;
		modalInput.multiSelection = multiSelection;
		return this._appContext.modalService.open<any>(<any>AddOnProductsModalComponent, ReflectiveInjector.resolve([
			provide(AddOnProductsModalInput, { useValue: modalInput })
		]));
	}
}