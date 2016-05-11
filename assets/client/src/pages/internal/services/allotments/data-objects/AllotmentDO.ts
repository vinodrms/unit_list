import {BaseDO} from '../../../../../common/base/BaseDO';
import {ThDateIntervalDO} from '../../common/data-objects/th-dates/ThDateIntervalDO';
import {AllotmentAvailabilityDO} from './availability/AllotmentAvailabilityDO';
import {AllotmentInventoryDO} from './inventory/AllotmentInventoryDO';
import {AllotmentConstraintWrapperDO} from './constraint/AllotmentConstraintWrapperDO';

export enum AllotmentStatus {
	Active,
	Archived
}

export class AllotmentDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	versionId: number;
	status: AllotmentStatus;
	customerId: string;
	priceProductId: string;
	roomCategoryId: string;
	openInterval: ThDateIntervalDO;
	availability: AllotmentAvailabilityDO;
	inventory: AllotmentInventoryDO;
	constraints: AllotmentConstraintWrapperDO;
	notes: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "status", "customerId", "priceProductId", "roomCategoryId", "notes"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.openInterval = new ThDateIntervalDO();
		this.openInterval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "openInterval"));

		this.availability = new AllotmentAvailabilityDO();
		this.availability.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "availability"));

		this.inventory = new AllotmentInventoryDO();
		this.inventory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "inventory"));

		this.constraints = new AllotmentConstraintWrapperDO();
		this.constraints.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraints"));
	}

	public isActive(): boolean {
		return this.status === AllotmentStatus.Active;
	}
}