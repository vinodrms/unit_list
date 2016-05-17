import {BaseDO} from '../../../../../../common/base/BaseDO';
import {BedAccommodationType} from '../../../beds/data-objects/BedDO';

export class BedTemplateDO extends BaseDO{
    constructor() {
		super();
	}
	id: string;
	name: string;
	iconUrl: string;
	accommodationType: BedAccommodationType;
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name", "iconUrl", "accommodationType"];
	}
}