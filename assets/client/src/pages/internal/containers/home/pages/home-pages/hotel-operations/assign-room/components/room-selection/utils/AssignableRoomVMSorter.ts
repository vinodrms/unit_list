import { SortOptions, SortOrder } from "../../../../../../../../../services/common/ILazyLoadRequestService";
import { ConfigCapacityDO } from "../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO";
import { RoomVM } from "../../../../../../../../../services/rooms/view-models/RoomVM";
import { AssignableRoomVM } from "../services/view-models/AssignableRoomVM";

import * as _ from "underscore";

export class AssignableRoomVMSorter {
    constructor() {
    }

    public sortRoomsBy(roomList: AssignableRoomVM[], sortOptions: SortOptions): AssignableRoomVM[] {
        var sortedResults = _.sortBy(roomList, (assignableRoomVM: AssignableRoomVM) => {
            if (sortOptions.objectPropertyId === 'roomCapacity') {
                var roomCapacity: ConfigCapacityDO = assignableRoomVM.roomVM.capacity;
                return (roomCapacity.noAdults * 4) + (roomCapacity.noChildren * 2) + roomCapacity.noBabies;
            }
            if (sortOptions.objectPropertyId === 'roomCategoryName') {
                return assignableRoomVM.roomVM.category.displayName;
            }
            return assignableRoomVM[sortOptions.objectPropertyId];
        });
        if (sortOptions.sortOrder === SortOrder.Descending) {
            sortedResults = sortedResults.reverse();
        }
        return sortedResults;
    }
}