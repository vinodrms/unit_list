import {RoomAttributeDO} from '../../../../../../../../services/common/data-objects/room-attribute/RoomAttributeDO';
import {RoomAttributesDO} from '../../../../../../../../services/settings/data-objects/RoomAttributesDO';

import * as _ from "underscore";

export class RoomAttributeVM {
    roomAttribute: RoomAttributeDO;
    isSelected: boolean;
    
    public toggle() {
        this.isSelected = !this.isSelected;
    }
}

export class RoomAttributeVMContainer {
    private _roomAttributeList: RoomAttributeVM[];
    
    constructor(roomAttributes: RoomAttributesDO, availableRoomAttributes: string[]) {
        this._roomAttributeList = [];
        roomAttributes.roomAttributeList.forEach((roomAttribute: RoomAttributeDO) => {
            var roomAttributeVM: RoomAttributeVM = new RoomAttributeVM();
            roomAttributeVM.roomAttribute = roomAttribute;
            roomAttributeVM.isSelected = _.contains(availableRoomAttributes, roomAttribute.id);
            this._roomAttributeList.push(roomAttributeVM);
        });
    }

    public resetRoomAttributeSelection() {
        this.updateRoomAttributeSelection([]);
    }
    public updateRoomAttributeSelection(attributeIdList: string[]) {
        this._roomAttributeList.forEach((roomAttributeVM: RoomAttributeVM) => {
            roomAttributeVM.isSelected = _.contains(attributeIdList, roomAttributeVM.roomAttribute.id);
        });
    }
    
    public get roomAttributeList(): RoomAttributeVM[] {
		return this._roomAttributeList;
	}
	public set roomAttributeList(roomAttributeList: RoomAttributeVM[]) {
		this._roomAttributeList = roomAttributeList;
	}
    
    public getSelectedRoomAttributeList(): string[] {
		var filteredRoomAttributes: RoomAttributeVM[] = _.filter(this._roomAttributeList, (roomAttributeVM: RoomAttributeVM) => {
			return roomAttributeVM.isSelected;
		})
		return _.map(filteredRoomAttributes, (roomAttributeVM: RoomAttributeVM) => {
			return roomAttributeVM.roomAttribute.id;
		});
	}
}