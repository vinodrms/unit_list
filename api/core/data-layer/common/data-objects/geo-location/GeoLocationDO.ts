import {BaseDO} from '../../base/BaseDO';

export class GeoLocationDO extends BaseDO {
	constructor() {
		super();
	}
	lng: number;
	lat: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["lng", "lat"];
	}
}