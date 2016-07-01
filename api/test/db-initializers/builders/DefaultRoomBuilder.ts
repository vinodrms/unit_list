import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {RoomDO, RoomStatus, RoomMaintenanceStatus} from '../../../core/data-layer/rooms/data-objects/RoomDO';
import {BedDO} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {TestUtils} from '../../helpers/TestUtils';
import {Locales} from '../../../core/utils/localization/ThTranslation';
import {AppContext} from '../../../core/utils/AppContext';
import {AmenityDO} from '../../../core/data-layer/common/data-objects/amenity/AmenityDO';
import {RoomAttributeDO} from '../../../core/data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import {TestContext} from '../../helpers/TestContext';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {RoomCategoryType} from './DefaultRoomCategoryBuilder';

import _ = require('underscore');

export interface IRoomDataSource {
    getRoomList(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO[];
}

export class DefaultRoomBuilder implements IRoomDataSource {
    private _testUtils: TestUtils;
    private _thUtils: ThUtils;
    
    constructor(private _testContext: TestContext) {
        this._testUtils = new TestUtils();
        this._thUtils = new ThUtils();
    }

    getRoomList(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO[] {
        var roomList = [];
        
        roomList.push(this.getFirstSingleRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getSecondSingleRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getDoubleDoubleRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getDoubleRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getTwinRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getStudioRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        roomList.push(this.getDoubleKingRoom(roomCategoryList, roomAttributeList, roomAmenityList));
        
        return roomList;
    }
    
    private getFirstSingleRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "101 Single";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.Single].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor single room description.";
        roomDO.notes = "First floor single room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getSecondSingleRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "102 Single";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.Single].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor second single room description.";
        roomDO.notes = "First floor second single room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getDoubleDoubleRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "103 Double Double";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.DoubleDouble].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor double double room description.";
        roomDO.notes = "First floor double double room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getDoubleRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "104 Double";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.Double].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor double room description.";
        roomDO.notes = "First floor double room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getTwinRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "105 Twin";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.Twin].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "First floor twin room description.";
        roomDO.notes = "First floor twin room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getStudioRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "201 Studio";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.Studio].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "Second floor studio room description.";
        roomDO.notes = "Second floor studio room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    private getDoubleKingRoom(roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): RoomDO {
        var roomDO = new RoomDO();
        roomDO.name = "202 Double King";
        roomDO.floor = 1;
        roomDO.categoryId = roomCategoryList[RoomCategoryType.DoubleKing].id;
        roomDO.amenityIdList = this._testUtils.getIdSampleFrom(roomAmenityList, 3);
        roomDO.attributeIdList = this._testUtils.getIdSampleFrom(roomAttributeList, 5);
        roomDO.description = "Second floor double king room description.";
        roomDO.notes = "Second floor double king room notes.";
        roomDO.maintenanceStatus = RoomMaintenanceStatus.Clean;
        roomDO.status = RoomStatus.Active;
        return roomDO;
    }
    
    public loadRooms(dataSource: IRoomDataSource, roomCategoryList: RoomCategoryDO[],
        roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]): Promise<RoomDO[]> {

        return new Promise<RoomDO[]>((resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadRoomsCore(resolve, reject, dataSource, roomCategoryList, roomAttributeList, roomAmenityList);
        });

    }
    private loadRoomsCore(resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }, dataSource: IRoomDataSource,
        roomCategoryList: RoomCategoryDO[], roomAttributeList: RoomAttributeDO[], roomAmenityList: AmenityDO[]) {

        var roomListToBeAdded = dataSource.getRoomList(roomCategoryList, roomAttributeList, roomAmenityList);
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