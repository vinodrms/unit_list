import {BaseDO} from '../../common/base/BaseDO';
import {HotelContactDetailsDO} from './hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../common/data-objects/geo-location/GeoLocationDO';
import {UserDO} from './user/UserDO';
import {HotelTaxesDO} from './taxes/HotelTaxesDO';
import {AmenityDO} from '../../common/data-objects/amenity/AmenityDO';
import {OperationHoursDO} from './operation-hours/OperationHoursDO';

export class HotelDO extends BaseDO {
	constructor() {
		super();
	}
	contactDetails: HotelContactDetailsDO;
	geoLocation: GeoLocationDO;
	logoUrl: string;
	users: UserDO[];
	ccy: string;
	taxes: HotelTaxesDO;
	amenities: string[];
	customAmenities: AmenityDO[];
	paymentMethods: string[];
	configurationStatus: boolean;
	timezone: string;
	operationHours: OperationHoursDO;

	protected getPrimitiveProperties(): string[] {
		return ["logoUrl", "ccy", "amenities", "paymentMethods", "configurationStatus", "timezone"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new HotelContactDetailsDO();
		this.contactDetails.buildFromObject(object["contactDetails"]);

		this.geoLocation = new GeoLocationDO();
		this.geoLocation.buildFromObject(object["geoLocation"]);

		this.users = [];
		this.forEachElementOf(object["users"], (userObject: Object) => {
			var userDO = new UserDO();
			userDO.buildFromObject(userObject);
			this.users.push(userDO);
		});

		this.taxes = new HotelTaxesDO();
		this.taxes.buildFromObject(object["taxes"]);

		this.customAmenities = [];
		this.forEachElementOf(object["customAmenities"], (amenityObject: Object) => {
			var amenityDO = new AmenityDO();
			amenityDO.buildFromObject(amenityObject);
			this.customAmenities.push(amenityDO);			
		});

		this.operationHours = new OperationHoursDO();
		this.operationHours.buildFromObject(object["operationHours"]);
	}
}