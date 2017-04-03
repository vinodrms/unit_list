import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { RoomSnapshotDO } from '../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO';
import { AllotmentsSnapshotDO } from '../../../data-layer/hotel-inventory-snapshots/data-objects/allotment/AllotmentsSnapshotDO';
import { AllotmentDO, AllotmentStatus } from '../../../data-layer/allotments/data-objects/AllotmentDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalUtils } from '../../../utils/th-dates/ThDateIntervalUtils';

import _ = require('underscore');

export class SnapshotUtils {
    constructor() {
    }

    public buildRoomSnapshots(roomList: RoomDO[]): RoomSnapshotDO[] {
        var roomSnapshotList: RoomSnapshotDO[] = [];
        _.forEach(roomList, (roomDO: RoomDO) => {
            if (roomDO.isInInventory) {
                var roomSnapshot = new RoomSnapshotDO();
                roomSnapshot.id = roomDO.id;
                roomSnapshot.categoryId = roomDO.categoryId;
                roomSnapshotList.push(roomSnapshot);
            }
        });
        return roomSnapshotList;
    }

    public buildAllotmentsSnapshot(allotmentList: AllotmentDO[], referenceDate: ThDateDO): AllotmentsSnapshotDO {
        var filteredAllotments: AllotmentDO[] = _.filter(allotmentList, (allotment: AllotmentDO) => {
            var thDateIntervalUtils = new ThDateIntervalUtils([allotment.openInterval]);
            return allotment.status === AllotmentStatus.Active &&
                thDateIntervalUtils.containsThDateDO(referenceDate);
        });
        var allotmentsSnapshot = new AllotmentsSnapshotDO();
        allotmentsSnapshot.activeAllotmentIdList = _.map(filteredAllotments, (allotment: AllotmentDO) => { return allotment.id });
        allotmentsSnapshot.totalNoOfRooms = 0;
        var isoWeekDay = referenceDate.getISOWeekDay();
        _.forEach(filteredAllotments, (allotment: AllotmentDO) => {
            var allotAvailability = allotment.availability.getAllotmentAvailabilityForDay(isoWeekDay);
            allotmentsSnapshot.totalNoOfRooms += allotment.availability.getAllotmentAvailabilityForDay(isoWeekDay).availableCount;
        });
        return allotmentsSnapshot;
    }
}