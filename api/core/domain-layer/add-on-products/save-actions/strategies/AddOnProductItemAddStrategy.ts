import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {AddOnProductDO} from '../../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {IAddOnProductItemActionStrategy} from '../IAddOnProductItemActionStrategy';
import {AddOnProductMetaRepoDO} from '../../../../data-layer/add-on-products/repositories/IAddOnProductRepository';

export class AddOnProductItemAddStrategy implements IAddOnProductItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _addOnProductDO: AddOnProductDO) {
	}
	save(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
		var aopMeta = this.buildAddOnProductMetaRepoDO();
		aopRepo.addAddOnProduct(aopMeta, this._addOnProductDO).then((result: AddOnProductDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildAddOnProductMetaRepoDO(): AddOnProductMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}