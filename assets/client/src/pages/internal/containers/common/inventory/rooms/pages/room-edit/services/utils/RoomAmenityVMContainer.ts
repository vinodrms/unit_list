import {AmenityDO} from '../../../../../../../../services/common/data-objects/amenity/AmenityDO';
import {RoomAmenitiesDO} from '../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';

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