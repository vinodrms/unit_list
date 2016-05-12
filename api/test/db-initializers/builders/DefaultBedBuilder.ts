import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO, BedSizeDO, BedStatus, BedCapacityDO, BedStorageType, BedAccommodationType} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';

import _ = require('underscore');

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
        bedList.push(this.getDoubleBed(bedTemplateList));
        bedList.push(this.getTwinBed(bedTemplateList));
        bedList.push(this.getSingleBed(bedTemplateList));
        bedList.push(this.getKingSizeBed(bedTemplateList));
        bedList.push(this.getBabyBed(bedTemplateList));
        bedList.push(this.getRollawaySingleBed(bedTemplateList));
        return bedList;
    }
    
    private getSingleBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Single Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 1;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 200;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
		bedDO.notes = "nice single bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[0])) {
            bedDO.bedTemplateId = bedTemplateList[0].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getDoubleBed(bedTemplateList: BedTemplateDO[]): BedDO {
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
		bedDO.notes = "nice double bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[1])) {
            bedDO.bedTemplateId = bedTemplateList[1].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }

    private getTwinBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Twin Bed";
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
		bedDO.notes = "nice twin bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[2])) {
            bedDO.bedTemplateId = bedTemplateList[2].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getKingSizeBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "King Size Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 250;
        bedDO.size = bedSize;
        bedDO.storageType = BedStorageType.Stationary;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
		bedDO.notes = "nice king size bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[3])) {
            bedDO.bedTemplateId = bedTemplateList[3].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getBabyBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Baby Bed";
        bedDO.storageType = BedStorageType.Rollaway;
        bedDO.accommodationType = BedAccommodationType.Babies;
		bedDO.notes = "nice baby bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[4])) {
            bedDO.bedTemplateId = bedTemplateList[4].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    private getRollawaySingleBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Rollaway Single Bed";
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 1;
        bedCapacity.maxNoChildren = 1;
        bedDO.capacity = bedCapacity;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 200;
        bedSize.widthCm = 200;
        bedDO.size = bedSize;
        bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        bedDO.storageType = BedStorageType.Rollaway;
		bedDO.notes = "nice rollaway single bed";
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList[0])) {
            bedDO.bedTemplateId = bedTemplateList[0].id;
        }
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