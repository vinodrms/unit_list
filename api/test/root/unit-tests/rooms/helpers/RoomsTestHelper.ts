import {BedDO} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../../../core/data-layer/rooms/data-objects/RoomDO';

import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class RoomsTestHelper {

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }
    
}