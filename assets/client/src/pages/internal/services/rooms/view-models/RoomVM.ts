import {RoomDO} from '../data-objects/RoomDO';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {BedDO} from '../../beds/data-objects/BedDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../common/data-objects/room-attribute/RoomAttributeDO';

export class RoomVM {

    private _room: RoomDO;
    private _category: RoomCategoryDO;
    private _bedList: BedDO[];
    private _roomAmenityList: AmenityDO[];
    private _roomAttributeList: RoomAttributeDO[];
    
    constructor() {   
    }
    
    public get room(): RoomDO {
        return this._room;
    }
    public set room(room: RoomDO) {
        this._room = room;
    }
    
    public get category(): RoomCategoryDO {
        return this._category;
    }
    public set category(category: RoomCategoryDO) {
        this._category = category;
    }
    
    public get bedList(): BedDO[] {
        return this._bedList;
    }
    public set bedList(bedList: BedDO[]) {
        this._bedList = bedList;
    }
    
    public get roomAmenityList(): AmenityDO[] {
        return this._roomAmenityList;
    }
    public set roomAmenityList(roomAmenityList: AmenityDO[]) {
        this._roomAmenityList = roomAmenityList;
    }
    
    public get roomAttributeList(): RoomAttributeDO[] {
        return this._roomAttributeList;
    }
    public set roomAttributeList(roomAttributeList: RoomAttributeDO[]) {
        this._roomAttributeList = roomAttributeList;
    }
    
    public buildPrototype(): RoomVM {
		var copy = new RoomVM();
		copy.room = new RoomDO();
        copy.room.buildFromObject(this.room);
        copy.category = new RoomCategoryDO();
        copy.category.buildFromObject(this.category);
        copy.bedList = [];
        this.bedList.forEach((bedItem: BedDO) => {
            var bedCopy = new BedDO();
            bedCopy.buildFromObject(bedItem);
            copy.bedList.push(bedCopy);    
        });
        copy.roomAmenityList = [];
        this.roomAmenityList.forEach((roomAmenityItem: AmenityDO) => {
            var roomAmenityCopy = new AmenityDO();
            roomAmenityCopy.buildFromObject(roomAmenityItem);
            copy.roomAmenityList.push(roomAmenityCopy);    
        });     
        copy.roomAttributeList = [];
        this.roomAttributeList.forEach((roomAttributeItem: RoomAttributeDO) => {
            var roomAttributeCopy = new RoomAttributeDO();
            roomAttributeCopy.buildFromObject(roomAttributeItem);
            copy.roomAttributeList.push(roomAttributeCopy);       
        });
		return copy;
	}
}