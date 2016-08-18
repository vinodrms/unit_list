import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../../../../../common/utils/AppContext';

import {NumberOfAddOnProductsModalInput} from './utils/NumberOfAddOnProductsModalInput';
import {NumberOfAddOnProductsModalComponent} from '../NumberOfAddOnProductsModalComponent';

@Injectable()
export class NumberOfAddOnProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openModal(aopId: string) {
		var modalInput = new NumberOfAddOnProductsModalInput();
		modalInput.addOnProductId = aopId;
		
		return this._appContext.modalService.open<any>(<any>NumberOfAddOnProductsModalComponent, ReflectiveInjector.resolve([
			provide(NumberOfAddOnProductsModalInput, { useValue: modalInput })
		]));
	}
}