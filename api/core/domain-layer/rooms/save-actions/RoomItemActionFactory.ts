import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {IRoomItemActionStrategy} from './IRoomItemActionStrategy';
import {RoomItemAddStrategy} from './strategies/RoomItemAddStrategy';
import {RoomItemUpdateStrategy} from './strategies/RoomItemUpdateStrategy';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';

export class RoomItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(roomDO: RoomDO): IRoomItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(roomDO.id)) {
			return new RoomItemAddStrategy(this._appContext, this._sessionContext, roomDO);
		}
		return new RoomItemUpdateStrategy(this._appContext, this._sessionContext, roomDO);
	}
}