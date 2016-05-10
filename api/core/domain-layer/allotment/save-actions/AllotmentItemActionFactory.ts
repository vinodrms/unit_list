import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {AllotmentDO} from '../../../data-layer/allotment/data-objects/AllotmentDO';
import {AllotmentMetaRepoDO} from '../../../data-layer/allotment/repositories/IAllotmentRepository';
import {IAllotmentItemActionStrategy} from './IAllotmentItemActionStrategy';
import {AllotmentItemAddStrategy} from './add-action/AllotmentItemAddStrategy';
import {AllotmentItemUpdateStrategy} from './update-action/AllotmentItemUpdateStrategy';

export class AllotmentItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(alRepoMeta: AllotmentMetaRepoDO, allotmentDO: AllotmentDO): IAllotmentItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(allotmentDO.id)) {
			return new AllotmentItemAddStrategy(this._appContext, this._sessionContext, alRepoMeta, allotmentDO);
		}
		return new AllotmentItemUpdateStrategy(this._appContext, this._sessionContext, alRepoMeta, allotmentDO);
	}
}