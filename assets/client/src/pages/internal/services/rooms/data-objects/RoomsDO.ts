import * as _ from "underscore";
import { BaseDO } from '../../../../../common/base/BaseDO';
import { RoomDO } from './RoomDO';

export class RoomsDO extends BaseDO {
    roomList: RoomDO[];

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.roomList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomList"), (roomObject: Object) => {
            var roomDO = new RoomDO();
            roomDO.buildFromObject(roomObject);
            this.roomList.push(roomDO);
        });
    }

    public getRoomById(roomId: string): RoomDO {
        return _.find(this.roomList, (room: RoomDO) => { return room.id === roomId });
    }
}
