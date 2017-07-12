import {AmenityDO} from '../../../../../../../../services/common/data-objects/amenity/AmenityDO';
import {RoomAmenitiesDO} from '../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';

import * as _ from "underscore";

export class RoomAmenityVM {
    roomAmenity: AmenityDO;
    isSelected: boolean;
    
    public toggle() {
        this.isSelected = !this.isSelected;
    }
}

export class RoomAmenityVMContainer {
    private _roomAmenityList: RoomAmenityVM[];
    
    constructor(roomAmenities: RoomAmenitiesDO, availableRoomAmenities: string[]) {
        this._roomAmenityList = [];
        roomAmenities.roomAmenityList.forEach((roomAmenity: AmenityDO) => {
            var roomAmenityVM: RoomAmenityVM = new RoomAmenityVM();
            roomAmenityVM.roomAmenity = roomAmenity;
            roomAmenityVM.isSelected = _.contains(availableRoomAmenities, roomAmenity.id);
            this._roomAmenityList.push(roomAmenityVM);
        });
    }
    public resetRoomAmenitySelection() {
        this.updateRoomAmenitySelection([]);
    }
    public updateRoomAmenitySelection(amenityIdList: string[]) {
        this._roomAmenityList.forEach((roomAmenityVM: RoomAmenityVM) => {
            roomAmenityVM.isSelected = _.contains(amenityIdList, roomAmenityVM.roomAmenity.id);
        });
    }
    
    public get roomAmenityList(): RoomAmenityVM[] {
		return this._roomAmenityList;
	}
	public set roomAmenityList(roomAmenityList: RoomAmenityVM[]) {
		this._roomAmenityList = roomAmenityList;
	}
    
    public getSelectedRoomAmenityList(): string[] {
		var filteredRoomAmenities: RoomAmenityVM[] = _.filter(this._roomAmenityList, (roomAmenityVM: RoomAmenityVM) => {
			return roomAmenityVM.isSelected;
		})
		return _.map(filteredRoomAmenities, (roomAmenityVM: RoomAmenityVM) => {
			return roomAmenityVM.roomAmenity.id;
		});
	}
}