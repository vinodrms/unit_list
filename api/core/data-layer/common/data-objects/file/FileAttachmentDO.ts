import {BaseDO} from '../../base/BaseDO';

export class FileAttachmentDO extends BaseDO {
	constructor() {
		super();
	}
	name: string;
	url: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["name", "url"];
	}
}