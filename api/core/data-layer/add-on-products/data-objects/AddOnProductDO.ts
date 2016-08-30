import {BaseDO} from '../../common/base/BaseDO';
import {AddOnProductSnapshotDO} from './AddOnProductSnapshotDO';
import {TaxDO} from '../../taxes/data-objects/TaxDO';
import {ThUtils} from '../../../utils/ThUtils';

import _ = require("underscore");

export enum AddOnProductStatus {
	Active,
	Deleted
}

export class AddOnProductDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	hotelId: string;
	versionId: number;
	status: AddOnProductStatus;
	categoryId: string;
	name: string;
	price: number;
	internalCost: number;
	taxIdList: string[];
	notes: string;
	fileUrlList: string[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "status", "categoryId", "name", "price", "internalCost", "taxIdList", "notes", "fileUrlList"];
	}

	public getAddOnProductSnapshotDO(): AddOnProductSnapshotDO {
		var snapshot = new AddOnProductSnapshotDO();
		snapshot.id = this.id;
		snapshot.categoryId = this.categoryId;
		snapshot.name = this.name;
		snapshot.price = this.price;
		snapshot.internalCost = this.internalCost;
		return snapshot;
	}

	public getVatValue(vatList: TaxDO[]): number {
		if (!_.isEmpty(this.taxIdList)) {
			var thUtils = new ThUtils();
			var vat = _.find(vatList, (vat: TaxDO) => {
				return vat.id === this.taxIdList[0];
			});
			if(!thUtils.isUndefinedOrNull(vat)) {
				return vat.value;
			}
		}
		return 0;
	}
}