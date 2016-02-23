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
    
	constructor(private _appContext: AppContext, private _hotelId: string, private _bedTemplateList: BedTemplateDO[]) {
		this._thUtils = new ThUtils();
		this._authUtils = new AuthUtils(this._appContext.getUnitPalConfig());
	}

	getBedList(): BedDO[] {
		var bedList = [];
        
        var bed = new BedDO();
		bed.hotelId = this._hotelId;
		bed.name = "Double Bed";
        bed.maxNoAdults = 2;
        bed.maxNoChildren = 1;
        
        var bedSize = new  BedSizeDO();
        bedSize.lengthCm = 100;
        bedSize.widthCm = 100;
        bed.size = bedSize;
        
        if(!this._thUtils.isUndefinedOrNull(this._bedTemplateList) && !_.isEmpty(this._bedTemplateList)) {
            bed.bedTemplateId = this._bedTemplateList[0].id; 
        }
        
        bed.status = BedStatus.Active;
        
        bedList.push(bed);
        
		return bedList;
	}
}