import { HotelUpdateBasicInfoDO } from '../../../../../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfoDO';
import { HotelDO } from '../../../../../core/data-layer/hotel/data-objects/HotelDO';
import { HotelUpdatePaymentsPoliciesDO } from '../../../../../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsPoliciesDO';
import { DefaultDataBuilder } from '../../../../db-initializers/DefaultDataBuilder';
import { PaymentMethodDO } from '../../../../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { AmenityDO } from '../../../../../core/data-layer/common/data-objects/amenity/AmenityDO';
import { HotelUpdatePropertyDetailsDO, HotelUpdatePropertyDetailsHourDO } from '../../../../../core/domain-layer/hotel-details/property-details/HotelUpdatePropertyDetailsDO';

import _ = require('underscore');

export class HotelDetailsTestHelper {
	public getHotelUpdateBasicInfoDO(hotel: HotelDO): HotelUpdateBasicInfoDO {
		var basicInfo: HotelUpdateBasicInfoDO = new HotelUpdateBasicInfoDO();
		basicInfo.versionId = hotel.versionId;
		basicInfo.contactDetails = {
			companyName: "THREEANGLE SOFTWARE SOLUTIONS SRL",
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

	public getHotelUpdatePaymentsPoliciesDO(dataBuilder: DefaultDataBuilder): HotelUpdatePaymentsPoliciesDO {
		var paymentMethodIdList: string[] = this.getPaymentMethodIdListFromPaymentMethodList(dataBuilder.paymentMethodList);

		return {
			ccyCode: "EUR",
			paymentMethodIdList: paymentMethodIdList,
			additionalInvoiceDetails: "IBAN RO34INGB736137812638"
		}
	}
	public getPaymentMethodIdListFromPaymentMethodList(paymentMethodList: PaymentMethodDO[]): string[] {
		var paymentMethodIdList: string[] = _.map(paymentMethodList, (paymentMethod: PaymentMethodDO) => {
			return paymentMethod.id;
		});
		return paymentMethodIdList;
	}
	public getHotelUpdatePropertyDetailsDO(dataBuilder: DefaultDataBuilder): HotelUpdatePropertyDetailsDO {
		return {
			timezone: "Europe/Bucharest",
			amenityIdList: _.map(dataBuilder.hotelAmenityList, (amenity: AmenityDO) => { return amenity.id }),
			operationHours: {
				checkInFrom: {
					hour: 14,
					minute: 0
				},
				checkInToOptional: {
					hour: 22,
					minute: 0
				},
				checkOutTo: {
					hour: 12,
					minute: 0
				},
				checkOutFromOptional: {
					hour: 7,
					minute: 0
				},
				cancellationHour: {
					hour: 18,
					minute: 0
				}
			}
		}
	}
}