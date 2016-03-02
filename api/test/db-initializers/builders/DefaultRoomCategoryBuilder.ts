import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';

import _ = require('underscore');

export class DefaultRoomCategoryBuilder {
    private _thUtils: ThUtils;
    private _authUtils;

    constructor(private _appContext: AppContext) {
        this._thUtils = new ThUtils();
        this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
    }

    getRoomCategoryList(): RoomCategoryDO[] {
        var roomCategoryList = [];
        roomCategoryList.push(this.getFirstRoomCategory());
        roomCategoryList.push(this.getSecondRoomCategory())
        return roomCategoryList;
    }

    getFirstRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        
        return roomCategoryDO;
    }
    
    getSecondRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        
        return roomCategoryDO;
    }
}