import {AssignableRoomVM} from './AssignableRoomVM';

export class AssignableRoomVMContainer {
    private _assignableRoomVMList: AssignableRoomVM[];

    constructor(private _allRoomWithOccupancyVMList: AssignableRoomVM[]) {
        this._assignableRoomVMList = this._allRoomWithOccupancyVMList;
    }

    public filterRoomCategoryId(roomCategoryId: string) {
        this._assignableRoomVMList = _.filter(this._allRoomWithOccupancyVMList, (roomWithOccupancyVM: AssignableRoomVM) => {
            return roomWithOccupancyVM.roomVM.category.id === roomCategoryId;
        });
    }
    public filterOtherCategoriesThanRoomCategoryId(roomCategoryId: string) {
        this._assignableRoomVMList = _.filter(this._allRoomWithOccupancyVMList, (roomWithOccupancyVM: AssignableRoomVM) => {
            return roomWithOccupancyVM.roomVM.category.id !== roomCategoryId;
        });
    }

    public get assignableRoomVMList(): AssignableRoomVM[] {
        return this._assignableRoomVMList;
    }
    public set assignableRoomVMList(assignableRoomVMList: AssignableRoomVM[]) {
        this._assignableRoomVMList = assignableRoomVMList;
    }
}