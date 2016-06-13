import {RoomCategoryDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {BedConfigDO} from '../../../../../core/data-layer/room-categories/data-objects/bed-config/BedConfigDO';
import {BedMetaDO} from '../../../../../core/data-layer/room-categories/data-objects/bed-config/BedMetaDO';
import {RoomDO} from '../../../../../core/data-layer/rooms/data-objects/RoomDO';
import {BedDO} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {SaveRoomCategoryItemDO} from '../../../../../core/domain-layer/room-categories/SaveRoomCategoryItemDO';
import {ConfigCapacityDO} from '../../../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestUtils} from '../../../../helpers/TestUtils';

import should = require('should');

export class RoomCategoriesTestHelper {
    private _testUtils: TestUtils;
    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
        this._testUtils = new TestUtils();
    }

    public getRoomCategoryItemDOWithInvalidDisplayName(): SaveRoomCategoryItemDO {
        return {
            displayName: "Xx",
            bedConfig: this.getRandomBedConfig(this._defaultDataBuilder.bedList, 2)
        };
    }
    
    public getSaveRoomCategoryItemDOWithInvalidBeds(): SaveRoomCategoryItemDO {
        return {
            displayName: "Yyyyyy",
            bedConfig: this.getInvalidBedConfig()
        };
    }
    
    public getValidSaveRoomCategoryItemDO(): SaveRoomCategoryItemDO {
        return {
            displayName: "Xxxxxxx",
            bedConfig: this.getRandomBedConfig(this._defaultDataBuilder.bedList, 2)
        };
    }
    
    public getValidWithEmptyBedListSaveRoomCategoryItemDO(): SaveRoomCategoryItemDO {
        return {
            displayName: "Zzzzzzz",
            bedConfig: this.getEmptyBedConfig()
        };
    }
    
    public getSavedRoomCategoryItemDOFrom(roomCategory: RoomCategoryDO): SaveRoomCategoryItemDO {
        var result = {
            displayName: roomCategory.displayName,
            bedConfig: roomCategory.bedConfig
        }
        result["id"] = roomCategory.id;
        return result;
    }
    
    public getDistinctRoomCategoriesFrom(roomList: RoomDO[]): string[] {
        var roomCategoryIdList = [];
        roomList.forEach(room => {
            if (!_.contains(roomCategoryIdList, room.categoryId))
                roomCategoryIdList.push(room.categoryId);
        });
        return roomCategoryIdList;
    }
    
    public validate(readRoomCategory: RoomCategoryDO, createdRoomCategory: RoomCategoryDO) {
        should.equal(readRoomCategory.hotelId, createdRoomCategory.hotelId);
        should.equal(readRoomCategory.displayName, createdRoomCategory.displayName);
    }
    
    public validateRoomCategoryStatsList(roomCategoryStatsList: RoomCategoryStatsDO[]) {
        should.equal(roomCategoryStatsList.length, 6);
        
        var categoryDisplayNameList: any = roomCategoryStatsList.map((roomCategoryStats) => { return roomCategoryStats.roomCategory.displayName });
        should.equal(_.contains(categoryDisplayNameList, 'Single Room'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Double Room'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Double Double Room'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Twin Room'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Studio Room'), true);
        should.equal(_.contains(categoryDisplayNameList, 'Double King Room'), true);
        
        roomCategoryStatsList.forEach((roomCategoryStats) => {
            if (roomCategoryStats.roomCategory.displayName === 'Single Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 1, 1, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 0, 0, 1);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 1, 1, 1);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Double Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 2, 1, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 0, 0, 2);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 2, 1, 2);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Double Double Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 4, 2, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 0, 0, 0);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 4, 2, 0);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Twin Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 2, 0, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 0, 0, 0);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 2, 0, 0);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Studio Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 2, 1, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 1, 1, 0);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 3, 2, 0);
            }
            else if (roomCategoryStats.roomCategory.displayName === 'Double King Room') {
                this.validateCapacity(roomCategoryStats.capacity.stationaryCapacity, 2, 2, 0);
                this.validateCapacity(roomCategoryStats.capacity.rollawayCapacity, 0, 0, 0);
                this.validateCapacity(roomCategoryStats.capacity.totalCapacity, 2, 2, 0);
            }
        });
    }
    
    public validateCapacity(capacity: ConfigCapacityDO, maxNoAdults: number, maxNoChildren: number, maxNoBabies: number) {
         should.equal(capacity.noAdults, maxNoAdults);
         should.equal(capacity.noChildren, maxNoChildren);
         should.equal(capacity.noBabies, maxNoBabies);   
    } 
    
    public getRandomBedConfig(bedList: BedDO[], noOfBeds: number): BedConfigDO {
       
        var bedConfig = new BedConfigDO();
        bedConfig.bedMetaList = [];
        
        var bedIdSample: string[] = this._testUtils.getIdSampleFrom(bedList, noOfBeds);
        _.forEach(bedIdSample, (bedId: string) => {
            var bedMeta = new BedMetaDO();
            bedMeta.bedId = bedId;
            bedMeta.noOfInstances = _.random(1, 3);
            bedConfig.bedMetaList.push(bedMeta);            
        });
        return bedConfig;        
    }
    
    public getInvalidBedConfig(): BedConfigDO {
        var bedConfig = new BedConfigDO();
        bedConfig.bedMetaList = [];
        
        var bedMetaDO = new BedMetaDO();
        bedMetaDO.bedId = "yyy";
        bedMetaDO.noOfInstances = 1;
        
        bedConfig.bedMetaList.push(bedMetaDO);
            
        return bedConfig;
    }
    
    public getEmptyBedConfig(): BedConfigDO {
        var bedConfig = new BedConfigDO();
        bedConfig.bedMetaList = [];
        return bedConfig;
    }
}