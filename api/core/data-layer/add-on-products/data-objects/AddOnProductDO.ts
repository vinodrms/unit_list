import {BaseDO} from '../../common/base/BaseDO';
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
	taxIdList: string[];
	notes: string;
	fileUrlList: string[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "hotelId", "versionId", "status", "categoryId", "name", "price", "taxIdList", "notes", "fileUrlList"];
	}
}