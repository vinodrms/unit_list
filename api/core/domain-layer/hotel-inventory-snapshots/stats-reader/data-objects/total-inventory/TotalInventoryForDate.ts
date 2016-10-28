import { ITotalInventoryForDate } from './ITotalInventoryForDate';
import { IRoom } from '../../../../../data-layer/rooms/data-objects/IRoom';

import _ = require('underscore');

export class TotalInventoryForDate implements ITotalInventoryForDate {
    private _noOfRooms: number;
    private _noOfRoomsWithAllotment: number;
    private _indexedRoomCategoryIds: { [id: string]: number; };

    public get noOfRooms(): number {
        return this._noOfRooms;
    }
    public set noOfRooms(noOfRooms: number) {
        this._noOfRooms = noOfRooms;
    }
    public get noOfRoomsWithAllotment(): number {
        return this._noOfRoomsWithAllotment;
    }
    public set noOfRoomsWithAllotment(noOfRoomsWithAllotment: number) {
        this._noOfRoomsWithAllotment = noOfRoomsWithAllotment;
    }

    public indexFrom(roomList: IRoom[]) {
        this._indexedRoomCategoryIds = _.countBy(roomList, (room: IRoom) => {
            return room.categoryId;
        });
    }
    public getNumberOfRoomsFor(roomCategoryId: string): number {
        var noRooms = this._indexedRoomCategoryIds[roomCategoryId];
        if (!_.isNumber(noRooms)) {
            return 0;
        }
        return noRooms;
    }
}