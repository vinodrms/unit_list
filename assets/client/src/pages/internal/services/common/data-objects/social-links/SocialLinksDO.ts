import {BaseDO} from '../../../../../../common/base/BaseDO';

export class SocialLinksDO extends BaseDO {
	constructor() {
		super();
	}
	facebookUrl: string;
	linkedinUrl: string;
	twitterUrl: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["facebookUrl", "linkedinUrl", "twitterUrl"];
	}
}