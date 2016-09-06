import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../../../../common/utils/AppContext';

import {NumberOfAddOnProductsModalInput} from './utils/NumberOfAddOnProductsModalInput';
import {NumberOfAddOnProductsModalComponent} from '../NumberOfAddOnProductsModalComponent';
import {NumberOfAddOnProductsModalModule} from '../NumberOfAddOnProductsModalModule';

@Injectable()
export class NumberOfAddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openModal(aopId: string) {
		var modalInput = new NumberOfAddOnProductsModalInput();
		modalInput.addOnProductId = aopId;

		return this._appContext.modalService.open<any>(NumberOfAddOnProductsModalModule, NumberOfAddOnProductsModalComponent, ReflectiveInjector.resolve([
			{ provide: NumberOfAddOnProductsModalInput, useValue: modalInput }
		]));
	}
}