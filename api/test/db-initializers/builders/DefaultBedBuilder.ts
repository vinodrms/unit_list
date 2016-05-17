import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO, BedSizeDO, BedStatus, BedCapacityDO, BedStorageType, BedAccommodationType} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';

import _ = require('underscore');

export enum BedType {
    SingleStationary,
    SingleRollaway,
    DoubleStationary,
    TwinStationary,
    KingSizeStationary,
    BabyRollaway,
    CouchStationary
}

export enum BedIcon {
    Single,
    Double,
    Modular,
    QueenKing,
    BabyCrib,
    Stacked,
    Couch,
    Custom
}

export interface IBedDataSource {
    getBedList(bedTemplateList: BedTemplateDO[]): BedDO[];
}

export class DefaultBedBuilder implements IBedDataSource {
    private _thUtils: ThUtils;

    constructor(private _testContext: TestContext) {
        this._thUtils = new ThUtils();

    }

    public getBedList(bedTemplateList: BedTemplateDO[]): BedDO[] {
        var bedList = [];
        
        bedList.push(this.getSingleStationary(bedTemplateList));
        bedList.push(this.getSingleRollaway(bedTemplateList));
        bedList.push(this.getDoubleStationary(bedTemplateList));
        bedList.push(this.getTwinStationary(bedTemplateList));
        bedList.push(this.getKingSizeStationary(bedTemplateList));
        bedList.push(this.getBabyRollaway(bedTemplateList));
        bedList.push(this.getCouchStationary(bedTemplateList));
        
        return bedList;
    }

    private getSingleStationary(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Single Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 1;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 150;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice single bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.Single].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getSingleRollaway(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Single Rollaway Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 1;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 150;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Rollaway;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice single rollaway bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.Single].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getDoubleStationary(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Double Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 200;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice double stationary bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.Double].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getTwinStationary(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Twin Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 1;
        bedCapacity.maxNoChildren = 0;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 150;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice twin bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.Double].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getKingSizeStationary(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "King Size Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 250;
        bedSize.widthCm = 250;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice king size bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.QueenKing].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getBabyRollaway(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Baby Rollaway Bed";
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 70;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Rollaway;
        bedDO.accommodationType = BedAccommodationType.Babies;
        bedDO.notes = "nice baby rollaway bed";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.BabyCrib].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getCouchStationary(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Couch for Two";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 200;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.notes = "nice couch for two";
        bedDO.bedTemplateId = bedTemplateList[BedIcon.Couch].id;
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    public loadBeds(dataSource: IBedDataSource, bedTemplateList: BedTemplateDO[]): Promise<BedDO[]> {
        return new Promise<BedDO[]>((resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadBedsCore(resolve, reject, dataSource, bedTemplateList);
        });
    }
    private loadBedsCore(resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }, dataSource: IBedDataSource, bedTemplateList: BedTemplateDO[]) {

        var bedListToBeAdded = dataSource.getBedList(bedTemplateList);
        var bedRepository = this._testContext.appContext.getRepositoryFactory().getBedRepository();
        var addBedsPromiseList: Promise<BedDO>[] = [];
        bedListToBeAdded.forEach((bedToBeAdded: BedDO) => {
            addBedsPromiseList.push(bedRepository.addBed({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, bedToBeAdded));
        });

        Promise.all(addBedsPromiseList).then((bedList: BedDO[]) => {
            resolve(bedList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}