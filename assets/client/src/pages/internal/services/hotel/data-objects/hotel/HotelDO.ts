import {BaseDO} from '../../../../../../common/base/BaseDO';
import {HotelContactDetailsDO} from './hotel-contact-details/HotelContactDetailsDO';
import {GeoLocationDO} from '../../../common/data-objects/geo-location/GeoLocationDO';
import {AmenityDO} from '../../../common/data-objects/amenity/AmenityDO';
import {OperationHoursDO} from './operation-hours/OperationHoursDO';

export class HotelDO extends BaseDO {
	constructor() {
		super();
	}
	versionId: number;
	contactDetails: HotelContactDetailsDO;
	geoLocation: GeoLocationDO;
	logoUrl: string;
	ccyCode: string;
	amenityIdList: string[];
	customAmenityList: AmenityDO[];
	paymentMethodIdList: string[];
	additionalInvoiceDetails: string;
	configurationCompleted: boolean;
	timezone: string;
	operationHours: OperationHoursDO;

	protected getPrimitivePropertyKeys(): string[] {
		return ["versionId", "logoUrl", "ccyCode", "amenityIdList", "paymentMethodIdList", "additionalInvoiceDetails", "configurationCompleted", "timezone"];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.contactDetails = new HotelContactDetailsDO();
		this.contactDetails.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "contactDetails"));

		this.geoLocation = new GeoLocationDO();
		this.geoLocation.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "geoLocation"));

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