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
        roomCategoryList.push(this.getSecondRoomCategory());
        roomCategoryList.push(this.getThirdRoomCategory());
        roomCategoryList.push(this.getFourthRoomCategory());
        return roomCategoryList;
    }

    private getFirstRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName="Double Standard";
        return roomCategoryDO;
    }
    
    private getSecondRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName="Double Standard with Two Single Beds";
        return roomCategoryDO;
    }
    
    private getThirdRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName="Quad";
        return roomCategoryDO;
    }
    
    private getFourthRoomCategory(): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName="Junior Suite for 4 adults";
        return roomCategoryDO;
    }
}