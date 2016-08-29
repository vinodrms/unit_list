import {ITotalInventoryForDate} from './ITotalInventoryForDate';

export class TotalInventoryForDate implements ITotalInventoryForDate {
    private _noOfRooms: number;
    private _noOfRoomsWithAllotment: number;

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
}