import {ThUtils} from '../../../utils/ThUtils';

import _ = require('underscore');

export class IndexedNumberOfRoomCategories {
    private _thUtils: ThUtils;
    private _indexedRoomCategoryId: Dictionary<number>;

    constructor(private _roomCategoryIdFromBookingList: string[]) {
        this._thUtils = new ThUtils();
        this.indexRoomCategories();
    }
    private indexRoomCategories() {
        this._indexedRoomCategoryId = _.countBy(this._roomCategoryIdFromBookingList, (roomCategoryIdFromBooking: string) => {
            return roomCategoryIdFromBooking;
        });
    }

    public getNoOfRoomsForCategoriId(roomCategoryId: string): number {
        var noOfRooms: number = this._indexedRoomCategoryId[roomCategoryId];
        if (this._thUtils.isUndefinedOrNull(noOfRooms) || !_.isNumber(noOfRooms)) {
            return 0;
        }
        return noOfRooms;
    }

    public getNoOfRoomsForCategoriIdList(roomCategoryIdList: string[]): number {
        var noOfRooms = 0;
        _.forEach(roomCategoryIdList, (roomCategoryId: string) => {
            noOfRooms += this.getNoOfRoomsForCategoriId(roomCategoryId);
        });
        return noOfRooms;
    }
}