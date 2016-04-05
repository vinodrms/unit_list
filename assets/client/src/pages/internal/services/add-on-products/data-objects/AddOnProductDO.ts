import {BaseDO} from '../../../../../common/base/BaseDO';

export class AddOnProductDO extends BaseDO {
	constructor() {
		super();
	}
	id: string;
	versionId: number;
	categoryId: string;
	name: string;
	price: number;
	internalCost: number;
	taxIdList: string[];
	notes: string;
	fileUrlList: string[];

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "categoryId", "name", "price", "internalCost", "taxIdList", "notes", "fileUrlList"];
	}
}