import {HotelUpdateBasicInfoDO} from '../../../../../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfoDO';
import {HotelDO} from '../../../../../core/data-layer/hotel/data-objects/HotelDO';

export class HotelDetailsTestHelper {
	public getHotelUpdateBasicInfoDO(hotel: HotelDO): HotelUpdateBasicInfoDO {
		var basicInfo: HotelUpdateBasicInfoDO = new HotelUpdateBasicInfoDO();
		basicInfo.versionId = hotel.versionId;
		basicInfo.contactDetails = {
			vatCode: "RO34221562",
			name: "3angleTECH Hotel",
			address: {
				streetAddress: "6D Regiei Boulevard",
				city: "Bucharest",
				country: {
					code: "RO",
					name: "Romania"
				},
				postalCode: "02179621"
			},
			phone: "+00338387281931",
			fax: "+00338387281931",
			email: "catalin.dobre@3angle.tech",
			websiteUrl: "www.google.ro",
			socialLinks: {
				facebookUrl: "http://facebook.com/sdakdasas/sdadadasdasdada",
				linkedinUrl: "http://linkedin.com/sdakdasas/sdadadasdasdada",
				twitterUrl: "http://twitter.com/sdakdasas/sdadadasdasdada",
			},
			contactName: "Catalin Andrei Dobre",
		};
		basicInfo.geoLocation = {
			lng: 55.23132,
			lat: 59.31321
		}
		basicInfo.logoUrl = "http://testtesttest/29129321.png";

		return basicInfo;
	}

}