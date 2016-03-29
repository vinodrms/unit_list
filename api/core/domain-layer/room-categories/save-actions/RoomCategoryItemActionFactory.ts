import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {IRoomCategoryItemActionStrategy} from './IRoomCategoryItemActionStrategy';
import {RoomCategoryItemAddStrategy} from './strategies/RoomCategoryItemAddStrategy';
import {RoomCategoryItemUpdateStrategy} from './strategies/RoomCategoryItemUpdateStrategy';
import {RoomCategoryDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';

export class RoomCategoryItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(roomCategoryDO: RoomCategoryDO): IRoomCategoryItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(roomCategoryDO.id)) {
			return new RoomCategoryItemAddStrategy(this._appContext, this._sessionContext, roomCategoryDO);
		}
		return new RoomCategoryItemUpdateStrategy(this._appContext, this._sessionContext, roomCategoryDO);
	}
}