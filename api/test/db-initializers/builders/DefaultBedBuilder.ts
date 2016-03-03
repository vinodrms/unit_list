import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO, BedSizeDO, BedStatus} from '../../../core/data-layer/common/data-objects/bed/BedDO';
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
        bedList.push(this.getTwinBed(bedTemplateList))
        return bedList;
    }

    private getDoubleBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Double Bed";
        bedDO.maxNoAdults = 2;
        bedDO.maxNoChildren = 1;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 100;
        bedDO.size = bedSize;
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList) && !_.isEmpty(bedTemplateList)) {
            bedDO.bedTemplateId = bedTemplateList[0].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }

    private getTwinBed(bedTemplateList: BedTemplateDO[]): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Twin Bed";
        bedDO.maxNoAdults = 2;
        bedDO.maxNoChildren = 1;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 120;
        bedDO.size = bedSize;
        if (!this._thUtils.isUndefinedOrNull(bedTemplateList) && bedTemplateList.length > 1) {
            bedDO.bedTemplateId = bedTemplateList[1].id;
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