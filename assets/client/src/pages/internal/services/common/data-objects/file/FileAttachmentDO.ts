import {BaseDO} from '../../../../../../common/base/BaseDO';

export class FileAttachmentDO extends BaseDO {
	constructor() {
		super();
	}
	name: string;
	url: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["name", "url"];
	}
}