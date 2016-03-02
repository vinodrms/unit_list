import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../core/data-layer/rooms/data-objects/RoomDO';
import {BedDO} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';

import _ = require('underscore');

export class DefaultRoomBuilder {
    private _thUtils: ThUtils;
    private _authUtils;

    constructor(private _appContext: AppContext, private _bedList: BedDO[]) {
        this._thUtils = new ThUtils();
        this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
    }

    getRoomList(): RoomDO[] {
        var roomList = [];
        roomList.push(this.getDoubleRoom());
        roomList.push(this.getTripleRoom())
        return roomList;
    }

    getDoubleRoom(): RoomDO {
        var roomDO = new RoomDO();
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    getTripleRoom(): RoomDO {
        var roomDO = new RoomDO();
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
}