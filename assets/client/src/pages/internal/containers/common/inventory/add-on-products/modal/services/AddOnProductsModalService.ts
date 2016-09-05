import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductsModalComponent} from '../AddOnProductsModalComponent';
import {AddOnProductsModalModule} from '../AddOnProductsModalModule';
import {AddOnProductDO} from '../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsModalInput} from './utils/AddOnProductsModalInput';

@Injectable()
export class AddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openAddOnProductsModal(multiSelection?: boolean): Promise<ModalDialogRef<AddOnProductDO[]>> {
		if (this._appContext.thUtils.isUndefinedOrNull(multiSelection)) {
			return this.openModal(false, true);
		}
		return this.openModal(false, multiSelection);
	}
	public openBreakfastModal(): Promise<ModalDialogRef<AddOnProductDO[]>> {
		return this.openModal(true, false);
	}
	private openModal(filterBreakfast: boolean, multiSelection: boolean) {
		var modalInput = new AddOnProductsModalInput();
		modalInput.filterBreakfast = filterBreakfast;
		modalInput.multiSelection = multiSelection;
		return this._appContext.modalService.open<any>(AddOnProductsModalModule, AddOnProductsModalComponent, ReflectiveInjector.resolve([
			{ provide: AddOnProductsModalInput, useValue: modalInput }
		]));
	}
}