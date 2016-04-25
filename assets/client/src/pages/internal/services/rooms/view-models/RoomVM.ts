import {RoomDO} from '../data-objects/RoomDO';
import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {BedDO} from '../../beds/data-objects/BedDO';
import {BedVM} from '../../beds/view-models/BedVM';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../common/data-objects/room-attribute/RoomAttributeDO';
import {CapacityDO} from '../../common/data-objects/capacity/CapacityDO';

export class RoomVM {

    private _room: RoomDO;
    private _category: RoomCategoryDO;
    private _bedList: BedVM[];
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
    
    public get bedList(): BedVM[] {
        return this._bedList;
    }
    public set bedList(bedList: BedVM[]) {
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
    
    public get imageUrl(): string {
        if(!this.room.fileUrlList) {
            this.room.fileUrlList = [];
        }
        if(_.isEmpty(this.room.fileUrlList)) {
            return null;
        }
        else {
            return this.room.fileUrlList[0];
        }
    }
    
    public set imageUrl(imageUrl: string) {
        if(!this.room.fileUrlList) {
            this.room.fileUrlList = [];
        }
        if(_.isEmpty(this.room.fileUrlList)) {
            this.room.fileUrlList.push(imageUrl);
        }
        else {
            this.room.fileUrlList[0] = imageUrl;
        }
    }
    
    public get capacity(): CapacityDO {
        var maxAdults = 0, maxChildren = 0;
        
        _.forEach(this.bedList, (bedVM: BedVM) => {
            maxAdults += bedVM.bed.maxNoAdults;
            maxChildren += bedVM.bed.maxNoChildren;
        });
        
        return {
            maxChildren: maxChildren,
            maxAdults: maxAdults
        }
    }
    
    public buildPrototype(): RoomVM {
		var copy = new RoomVM();
		copy.room = new RoomDO();
        copy.room.buildFromObject(this.room);
        copy.category = new RoomCategoryDO();
        copy.category.buildFromObject(this.category);
        
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
        copy.bedList = [];
        this.bedList.forEach((bedVM: BedVM) => {
            var bedVMCopy = new BedVM();    
            bedVMCopy.buildFromObject(bedVM);
            copy.bedList.push(bedVMCopy);
        });
		return copy;
	}
}