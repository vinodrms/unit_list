import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../core/data-layer/rooms/data-objects/RoomDO';
import {BedDO} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {TestUtils} from '../../helpers/TestUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';
import {AmenityDO} from '../../../core/data-layer/common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../../core/data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import {TestContext} from '../../helpers/TestContext';
import {ThError} from '../../../core/utils/th-responses/ThError';

import _ = require('underscore');

export interface IRoomDataSource {
    getRoomList(bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO[];
}

export class DefaultRoomBuilder implements IRoomDataSource {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;
    
    constructor(private _testContext: TestContext) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    getRoomList(bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO[] {
        var roomList = [];
        
        roomList.push(this.getSingleRoom(bedList, roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getDoubleRoom(bedList, roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getTripleRoom(bedList, roomCategoryList, roomAttributeList, roomAmenityList));
        
        return roomList;
    }
    
    private getSingleRoom(bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "201 Single Room";
        roomDO.floor = 2;
        if(!this._thUtils.isUndefinedOrNull(roomCategoryList[4])) {
            roomDO.categoryId = roomCategoryList[4].id;
        }
        roomDO.bedIdList = [];
        if(!this._thUtils.isUndefinedOrNull(bedList[2])) {
            roomDO.bedIdList.push(bedList[2].id);
        }
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "Second floor single room description.";
        roomDO.notes = "Second floor single room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.CheckInReady;
        roomDO.status = RoomStatus.Active;
        
        return roomDO;
    }
    
    private getDoubleRoom(bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "101 Double Room";
        roomDO.floor = 1;
        if(!this._thUtils.isUndefinedOrNull(roomCategoryList[0])) {
            roomDO.categoryId = roomCategoryList[0].id;
        }
        roomDO.bedIdList = [];
        if(!this._thUtils.isUndefinedOrNull(bedList[0])) {
            roomDO.bedIdList.push(bedList[0].id);
        }
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor double room description.";
        roomDO.notes = "First floor double room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.CheckInReady;
        roomDO.status = RoomStatus.Active;
        
        return roomDO;
    }
    
    private getTripleRoom(bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        var roomDO = new RoomDO();
        roomDO.name = "102 Triple Room";
        roomDO.floor = 1;
        if(!this._thUtils.isUndefinedOrNull(roomCategoryList[5])) {
            roomDO.categoryId = roomCategoryList[5].id;
        }
        roomDO.bedIdList = [];
        if(!this._thUtils.isUndefinedOrNull(bedList[0])) {
            roomDO.bedIdList.push(bedList[0].id);
        }
        if(!this._thUtils.isUndefinedOrNull(bedList[2])) {
            roomDO.bedIdList.push(bedList[2].id);
        }
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 4);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 6);
        roomDO.description = "First floor triple room description.";
        roomDO.notes = "First floor triple room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.CheckInReady;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    public loadRooms(dataSource: IRoomDataSource, bedList: BedDO[], roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): Promise<RoomDO[]> {

        return new Promise<RoomDO[]>((resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadRoomsCore(resolve, reject, dataSource, bedList, roomCategoryList, roomAttributeList, roomAmenityList);
        });

    }
    private loadRoomsCore(resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }, dataSource: IRoomDataSource, bedList: BedDO[],
        roomCategoryList: RoomCategoryDO[], roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]) {

        var roomListToBeAdded = dataSource.getRoomList(bedList, roomCategoryList, roomAttributeList, roomAmenityList);
        var roomRepository = this._testContext.appContext.getRepositoryFactory().getRoomRepository();
        var addRoomsPromiseList: Promise<RoomDO>[] = [];
        roomListToBeAdded.forEach((roomToBeAdded: RoomDO) => {
            addRoomsPromiseList.push(roomRepository.addRoom({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, roomToBeAdded));
        });

        Promise.all(addRoomsPromiseList).then((roomList: RoomDO[]) => {
            resolve(roomList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}