import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {CustomerRegisterModalInput} from './utils/CustomerRegisterModalInput';
import {CustomerDO} from '../../../../../../services/customers/data-objects/CustomerDO';
import {CustomerRegisterModalComponent} from '../CustomerRegisterModalComponent';
import {CustomerRegisterModalModule} from '../CustomerRegisterModalModule';

@Injectable()
export class CustomerRegisterModalService {
	constructor(private _appContext: AppContext) { }

	public openCustomerRegisterModal(multiSelection: boolean): Promise<ModalDialogRef<CustomerDO[]>> {
		var customerRegisterModalInput = new CustomerRegisterModalInput();
		customerRegisterModalInput.multiSelection = multiSelection;

		return this._appContext.modalService.open<any>(CustomerRegisterModalModule, CustomerRegisterModalComponent, ReflectiveInjector.resolve([
			{ provide: CustomerRegisterModalInput, useValue: customerRegisterModalInput }
		]));
	}
}