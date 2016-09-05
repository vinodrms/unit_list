import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceProductsModalInput} from './utils/PriceProductsModalInput';
import {PriceProductStatus, PriceProductDO} from '../../../../../../services/price-products/data-objects/PriceProductDO';
import {PriceProductsModalComponent} from '../PriceProductsModalComponent';
import {PriceProductsModalModule} from '../PriceProductsModalModule';

@Injectable()
export class PriceProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openPriceProductsModal(priceProductStatus: PriceProductStatus): Promise<ModalDialogRef<PriceProductDO[]>> {
		var priceProductModalInput = new PriceProductsModalInput();
		priceProductModalInput.priceProductStatus = priceProductStatus;

		return this._appContext.modalService.open<any>(PriceProductsModalModule, PriceProductsModalComponent, ReflectiveInjector.resolve([
			{ provide: PriceProductsModalInput, useValue: priceProductModalInput }
		]));
	}
}