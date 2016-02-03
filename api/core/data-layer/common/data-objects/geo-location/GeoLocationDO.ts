import {BaseDO} from '../../base/BaseDO';

export class GeoLocationDO extends BaseDO {
	constructor() {
		super();
	}
	lng: number;
	lat: number;

	protected getPrimitiveProperties(): string[] {
		return ["lng", "lat"];
	}
}