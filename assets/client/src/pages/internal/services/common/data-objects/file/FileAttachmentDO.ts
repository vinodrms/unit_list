import {BaseDO} from '../../../../../../common/base/BaseDO';

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