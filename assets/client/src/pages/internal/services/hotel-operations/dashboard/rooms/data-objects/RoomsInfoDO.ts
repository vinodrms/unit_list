import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThDateDO} from '../../../../common/data-objects/th-dates/ThDateDO';
import {RoomItemInfoDO} from './RoomItemInfoDO';

import * as _ from "underscore";

export class RoomsInfoDO extends BaseDO {
    roomInfoList: RoomItemInfoDO[];
    referenceDate: ThDateDO;

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.roomInfoList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomInfoList"), (roomItemObject: Object) => {
            var roomItemInfoDO = new RoomItemInfoDO();
            roomItemInfoDO.buildFromObject(roomItemObject);
            this.roomInfoList.push(roomItemInfoDO);
        });

        this.referenceDate = new ThDateDO();
        this.referenceDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "referenceDate"));
    }

    public getRoomItemInfoDOByRoomId(roomId: string): RoomItemInfoDO {
        return _.find(this.roomInfoList, (roomItem: RoomItemInfoDO) => {
            return roomItem.roomId === roomId;
        });
    }
}