import {BedTemplateDO} from '../../../core/data-layer/common/data-objects/bed-template/BedTemplateDO';
import {BedDO, BedSizeDO, BedStatus} from '../../../core/data-layer/common/data-objects/bed/BedDO';
import {AuthUtils} from '../../../core/domain-layer/hotel-account/utils/AuthUtils';
import {ThUtils} from '../../../core/utils/ThUtils';
import {Locales} from '../../../core/utils/localization/Translation';
import {AppContext} from '../../../core/utils/AppContext';

import _ = require('underscore');

export class DefaultBedBuilder {
    private _thUtils: ThUtils;
    private _authUtils;

    constructor(private _appContext: AppContext, private _bedTemplateList: BedTemplateDO[]) {
        this._thUtils = new ThUtils();
        this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
    }

    getBedList(): BedDO[] {
        var bedList = [];
        bedList.push(this.getDoubleBed());
        bedList.push(this.getTwinBed())
        return bedList;
    }

    getDoubleBed(): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Double Bed";
        bedDO.maxNoAdults = 2;
        bedDO.maxNoChildren = 1;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 100;
        bedDO.size = bedSize;
        if (!this._thUtils.isUndefinedOrNull(this._bedTemplateList) && !_.isEmpty(this._bedTemplateList)) {
            bedDO.bedTemplateId = this._bedTemplateList[0].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
    
    getTwinBed(): BedDO {
        var bedDO = new BedDO();
        bedDO.name = "Twin Bed";
        bedDO.maxNoAdults = 2;
        bedDO.maxNoChildren = 1;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 120;
        bedDO.size = bedSize;
        if (!this._thUtils.isUndefinedOrNull(this._bedTemplateList) && this._bedTemplateList.length > 1) {
            bedDO.bedTemplateId = this._bedTemplateList[1].id;
        }
        bedDO.status = BedStatus.Active;
        return bedDO;
    }
}