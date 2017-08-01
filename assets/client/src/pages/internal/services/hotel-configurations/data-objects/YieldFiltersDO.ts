import {BaseDO} from '../../../../../common/base/BaseDO';
import {YieldFilterDO} from '../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../common/data-objects/yield-filter/YieldFilterValueDO';

import * as _ from "underscore";

export class YieldFiltersDO extends BaseDO {
	yieldFilterList: YieldFilterDO[];
	
	constructor() {
		super();
		this.yieldFilterList = [];
	}

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.yieldFilterList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "value"), (yieldFilterObject: Object) => {
			var yieldFilterDO = new YieldFilterDO();
			yieldFilterDO.buildFromObject(yieldFilterObject);
			this.yieldFilterList.push(yieldFilterDO);
		});
	}
	public getYieldFilterByFilterId(filterId: string): YieldFilterDO {
		return _.find(this.yieldFilterList, (yieldFilter: YieldFilterDO) => { return yieldFilter.id === filterId });
	}
}