import {BaseDO} from '../../../common/base/BaseDO';
import {AddressDO} from '../../../common/data-objects/address/AddressDO';
import {SocialLinksDO} from '../../../common/data-objects/social-links/SocialLinksDO';

export class HotelContactDetailsDO extends BaseDO {
	constructor() {
		super();
	}
	name: string;
	address: AddressDO;
	phone: string;
	fax: string;
	email: string;
	socialLinks: SocialLinksDO;

	protected getPrimitiveProperties(): string[] {
		return ["name", "phone", "fax", "email"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);
		this.address = new AddressDO();
		this.address.buildFromObject(object["address"]);
		this.socialLinks = new SocialLinksDO();
		this.socialLinks.buildFromObject(object["socialLinks"]);
	}
}