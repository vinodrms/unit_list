import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {IYieldFilterValueActionStrategy} from './IYieldFilterValueActionStrategy';
import {YieldFilterValueAddStrategy} from './strategies/YieldFilterValueAddStrategy';
import {YieldFilterValueUpdateStrategy} from './strategies/YieldFilterValueUpdateStrategy';
import {YieldFilterValueDO} from '../../../../data-layer/common/data-objects/yield-filter/YieldFilterValueDO';
import {YieldFilterMetaRepoDO} from '../../../../data-layer/hotel-configurations/repositories/IYieldFilterConfigurationRepository';

export class YieldFilterValueActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(yieldFilterMeta: YieldFilterMetaRepoDO, yieldFilterValueDO: YieldFilterValueDO): IYieldFilterValueActionStrategy {
		if (this._thUtils.isUndefinedOrNull(yieldFilterValueDO.id)) {
			return new YieldFilterValueAddStrategy(this._appContext, this._sessionContext, yieldFilterMeta, yieldFilterValueDO);
		}
		return new YieldFilterValueUpdateStrategy(this._appContext, this._sessionContext, yieldFilterMeta, yieldFilterValueDO);
	}
}