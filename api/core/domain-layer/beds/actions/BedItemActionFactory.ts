import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {IBedItemActionStrategy} from './IBedItemActionStrategy';
import {BedItemAddStrategy} from './strategies/BedItemAddStrategy';
import {BedItemUpdateStrategy} from './strategies/BedItemUpdateStrategy';
import {BedDO} from '../../../data-layer/common/data-objects/bed/BedDO';

export class BedItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(bedDO: BedDO): IBedItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(bedDO.id)) {
			return new BedItemAddStrategy(this._appContext, this._sessionContext, bedDO);
		}
		return new BedItemUpdateStrategy(this._appContext, this._sessionContext, bedDO);
	}
}