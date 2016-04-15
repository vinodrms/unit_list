import {Injectable, Injector, provide} from 'angular2/core';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {ModalDialogInstance} from '../../../../../../../../common/utils/modals/utils/ModalDialogInstance';
import {PriceProductsModalInput} from './utils/PriceProductsModalInput';
import {PriceProductStatus, PriceProductDO} from '../../../../../../services/price-products/data-objects/PriceProductDO';
import {PriceProductsModalComponent} from '../PriceProductsModalComponent';

@Injectable()
export class PriceProductsModalService {
	constructor(private _appContext: AppContext) { }

	public openPriceProductsModal(priceProductStatus: PriceProductStatus): Promise<ModalDialogInstance<PriceProductDO>> {
		var priceProductModalInput = new PriceProductsModalInput();
		priceProductModalInput.priceProductStatus = priceProductStatus;

		return this._appContext.modalService.open<any>(<any>PriceProductsModalComponent, Injector.resolve([
			provide(PriceProductsModalInput, { useValue: priceProductModalInput })
		]));
	}
}