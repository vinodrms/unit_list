import {BaseDO} from '../../common/base/BaseDO';
import {RoomSnapshotDO} from './room/RoomSnapshotDO';
import {AllotmentsSnapshotDO} from './allotment/AllotmentsSnapshotDO';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';

export class HotelInventorySnapshotDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;
    roomList: RoomSnapshotDO[];
    allotments: AllotmentsSnapshotDO;
    thDate: ThDateDO;
    thDateUtcTimestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "thDateUtcTimestamp"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.roomList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomList"), (roomObject: Object) => {
            var roomDO = new RoomSnapshotDO();
            roomDO.buildFromObject(roomObject);
            this.roomList.push(roomDO);
        });

        this.allotments = new AllotmentsSnapshotDO();
        this.allotments.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "allotments"));

        this.thDate = new ThDateDO();
        this.thDate.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "thDate"));
    }
}