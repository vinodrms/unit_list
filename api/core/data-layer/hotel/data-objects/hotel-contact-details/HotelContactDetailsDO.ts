import {BaseDO} from '../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {SocialLinksDO} from '../../../common/data-objects/social-links/SocialLinksDO';

export class HotelContactDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	vatCode: string;
	name: string;
	address: AddressDO;
	phone: string;
	fax: string;
	email: string;
	websiteUrl: string;
	socialLinks: SocialLinksDO;
	contactName: string;

	protected getPrimitivePropertyKeys(): string[] {
		return ["vatCode", "name", "phone", "fax", "email", "websiteUrl", "contactName"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));
		this.socialLinks = new SocialLinksDO();
		this.socialLinks.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "socialLinks"));
	}
}