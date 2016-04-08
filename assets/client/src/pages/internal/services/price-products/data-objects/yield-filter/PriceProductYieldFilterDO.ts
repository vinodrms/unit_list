import {BaseDO} from '../../../../../../common/base/BaseDO';

export class PriceProductYieldFilterMetaDO extends BaseDO {
	filterId: string;
	valueId: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["filterId", "valueId"];
	}
}