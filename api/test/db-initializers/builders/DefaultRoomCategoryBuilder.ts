import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {BedConfigDO} from '../../../core/data-layer/room-categories/data-objects/bed-config/BedConfigDO';
import {BedMetaDO} from '../../../core/data-layer/room-categories/data-objects/bed-config/BedMetaDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/ThTranslation';
import {AppContext} from '../../../core/utils/AppContext';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';
import {BedDO} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {BedType} from './DefaultBedBuilder';

import _ = require('underscore');

export enum RoomCategoryType {
    Single,
    Double,
    DoubleDouble,
    Twin,
    Studio,
    DoubleKing
}

export interface IRoomCategoryDataSource {
    getRoomCategoryList(bedList: BedDO[]): RoomCategoryDO[];
}

export class DefaultRoomCategoryBuilder implements IRoomCategoryDataSource {
    private _thUtils: ThUtils;
    
    constructor(private _testContext: TestContext) {
        this._thUtils = new ThUtils();
    }

    public getRoomCategoryList(bedList: BedDO[]): RoomCategoryDO[] {
        var roomCategoryList = [];
        roomCategoryList.push(this.getSingleRoomCategory(bedList));
        roomCategoryList.push(this.getDoubleRoomCategory(bedList));
        roomCategoryList.push(this.getDoubleDoubleRoomCategory(bedList));
        roomCategoryList.push(this.getTwinRoomCategory(bedList));
        roomCategoryList.push(this.getStudioRoomCategory(bedList));
        roomCategoryList.push(this.getDoubleKingRoomCategory(bedList));
        return roomCategoryList;
    }

    private getSingleRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Single Room";
        
        var singleStationaryMeta = new BedMetaDO();
        singleStationaryMeta.bedId = bedList[BedType.SingleStationary].id;
        singleStationaryMeta.noOfInstances = 1;
        
        var babyRollawayMeta = new BedMetaDO();
        babyRollawayMeta.bedId = bedList[BedType.BabyRollaway].id;
        babyRollawayMeta.noOfInstances = 1;
        
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(singleStationaryMeta);
        roomCategoryDO.bedConfig.bedMetaList.push(babyRollawayMeta);
        
        return roomCategoryDO;
    }

    private getDoubleRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Double Room";
        
        var doubleStationaryMeta = new BedMetaDO();
        doubleStationaryMeta.bedId = bedList[BedType.DoubleStationary].id;
        doubleStationaryMeta.noOfInstances = 1;
        
        var babyRollawayMeta = new BedMetaDO();
        babyRollawayMeta.bedId = bedList[BedType.BabyRollaway].id;
        babyRollawayMeta.noOfInstances = 2;
       
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(doubleStationaryMeta);
        roomCategoryDO.bedConfig.bedMetaList.push(babyRollawayMeta);
        
        return roomCategoryDO;
    }

    private getDoubleDoubleRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Double Double Room";
        
        var doubleStationaryMeta = new BedMetaDO();
        doubleStationaryMeta.bedId = bedList[BedType.DoubleStationary].id;
        doubleStationaryMeta.noOfInstances = 2;
        
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(doubleStationaryMeta);
        
        return roomCategoryDO;
    }

    private getTwinRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Twin Room";
        
        var twinStationaryMeta = new BedMetaDO();
        twinStationaryMeta.bedId = bedList[BedType.TwinStationary].id;
        twinStationaryMeta.noOfInstances = 2;
        
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(twinStationaryMeta);
        
        return roomCategoryDO;
    }
    
    private getStudioRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Studio Room";
        
        var couchStationaryMeta = new BedMetaDO();
        couchStationaryMeta.bedId = bedList[BedType.CouchStationary].id;
        couchStationaryMeta.noOfInstances = 1;
        
        var singleRollawayMeta = new BedMetaDO();
        singleRollawayMeta.bedId = bedList[BedType.SingleRollaway].id;
        singleRollawayMeta.noOfInstances = 1;
        
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(couchStationaryMeta);
        roomCategoryDO.bedConfig.bedMetaList.push(singleRollawayMeta);
        
        return roomCategoryDO;
    }
    
    private getDoubleKingRoomCategory(bedList: BedDO[]): RoomCategoryDO {
        var roomCategoryDO = new RoomCategoryDO();
        roomCategoryDO.displayName = "Double King Room";
        
        var kingStationaryMeta = new BedMetaDO();
        kingStationaryMeta.bedId = bedList[BedType.KingSizeStationary].id;
        kingStationaryMeta.noOfInstances = 1;
        
        roomCategoryDO.bedConfig = new BedConfigDO();
        roomCategoryDO.bedConfig.bedMetaList = [];
        roomCategoryDO.bedConfig.bedMetaList.push(kingStationaryMeta);
        return roomCategoryDO;
    }
    
    public loadRoomCategories(dataSource: IRoomCategoryDataSource, bedList: BedDO[]): Promise<RoomCategoryDO[]> {
        return new Promise<RoomCategoryDO[]>((resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadRoomCategoriesCore(resolve, reject, dataSource, bedList);
        });
    }
    private loadRoomCategoriesCore(resolve: { (result: RoomCategoryDO[]): void }, reject: { (err: ThError): void }, dataSource: IRoomCategoryDataSource, bedList: BedDO[]) {

        var roomCategoriesToBeAded = dataSource.getRoomCategoryList(bedList);
        var roomCategoryRepository = this._testContext.appContext.getRepositoryFactory().getRoomCategoryRepository();
        var addRoomCategoriesPromiseList: Promise<RoomCategoryDO>[] = [];
        roomCategoriesToBeAded.forEach((roomCategoryToBeAdded: RoomCategoryDO) => {
            addRoomCategoriesPromiseList.push(roomCategoryRepository.addRoomCategory({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, roomCategoryToBeAdded));
        });

        Promise.all(addRoomCategoriesPromiseList).then((roomCategoriesList: RoomCategoryDO[]) => {
            resolve(roomCategoriesList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}