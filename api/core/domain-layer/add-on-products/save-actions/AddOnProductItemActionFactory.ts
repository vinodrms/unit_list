import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {IAddOnProductItemActionStrategy} from './IAddOnProductItemActionStrategy';
import {AddOnProductItemAddStrategy} from './strategies/AddOnProductItemAddStrategy';
import {AddOnProductItemUpdateStrategy} from './strategies/AddOnProductItemUpdateStrategy';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

export class AddOnProductItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(addOnProductDO: AddOnProductDO): IAddOnProductItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(addOnProductDO.id)) {
			return new AddOnProductItemAddStrategy(this._appContext, this._sessionContext, addOnProductDO);
		}
		return new AddOnProductItemUpdateStrategy(this._appContext, this._sessionContext, addOnProductDO);
	}
}