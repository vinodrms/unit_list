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
	id: string;
	versionId: number;
	contactDetails: HotelContactDetailsDO;
	geoLocation: GeoLocationDO;
	logoUrl: string;
	userList: UserDO[];
	ccyCode: string;
	taxes: HotelTaxesDO;
	amenityIdList: string[];
	customAmenityList: AmenityDO[];
	paymentMethodIdList: string[];
	configurationCompleted: boolean;
	timezone: string;
	operationHours: OperationHoursDO;

	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "logoUrl", "ccyCode", "amenityIdList", "paymentMethodIdList", "configurationCompleted", "timezone"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new HotelContactDetailsDO();
		this.contactDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "contactDetails"));

		this.geoLocation = new GeoLocationDO();
		this.geoLocation.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "geoLocation"));

		this.userList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "userList"), (userObject: Object) => {
			var userDO = new UserDO();
			userDO.buildFromObject(userObject);
			this.userList.push(userDO);
		});

		this.taxes = new HotelTaxesDO();
		this.taxes.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "taxes"));

		this.customAmenityList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "customAmenityList"), (amenityObject: Object) => {
			var amenityDO = new AmenityDO();
			amenityDO.buildFromObject(amenityObject);
			this.customAmenityList.push(amenityDO);
		});

		this.operationHours = new OperationHoursDO();
		this.operationHours.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "operationHours"));
	}
}