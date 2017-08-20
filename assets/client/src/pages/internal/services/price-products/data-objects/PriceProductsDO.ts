import { BaseDO } from '../../../../../common/base/BaseDO';
import { PriceProductDO } from './PriceProductDO';

import * as _ from "underscore";

export class PriceProductsDO extends BaseDO {
	priceProductList: PriceProductDO[];

	constructor() {
		super();
		this.priceProductList = [];
	}

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.priceProductList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "priceProductList"), (ppObject: Object) => {
			var ppDO = new PriceProductDO();
			ppDO.buildFromObject(ppObject);
			this.priceProductList.push(ppDO);
		});
	}

	public getParentIdList(): string[] {
		let priceProductWithParentList = _.filter(this.priceProductList, pp => { return pp.hasParent(); });
		let parentIdList: string[] = _.map(priceProductWithParentList, pp => { return pp.parentId });
		return _.uniq(parentIdList);
	}

	public findById(priceProductId: string): PriceProductDO {
		return _.find(this.priceProductList, pp => { return pp.id === priceProductId; });
	}
}