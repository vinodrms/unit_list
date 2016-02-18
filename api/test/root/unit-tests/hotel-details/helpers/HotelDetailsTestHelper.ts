import {HotelUpdateBasicInfoDO} from '../../../../../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfoDO';
import {HotelDO} from '../../../../../core/data-layer/hotel/data-objects/HotelDO';
import {HotelAddPaymentsPoliciesDO, HotelAddPaymentsPoliciesOtherTaxDO, HotelAddPaymentsPoliciesVatDO} from '../../../../../core/domain-layer/hotel-details/payment-policies/HotelAddPaymentsPoliciesDO';
import {TaxDO, TaxType} from '../../../../../core/data-layer/common/data-objects/taxes/TaxDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {PaymentMethodDO} from '../../../../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {HotelSaveTaxItemDO} from '../../../../../core/domain-layer/hotel-details/payment-policies/HotelSaveTaxItem';
import {TaxItemType} from '../../../../../core/domain-layer/hotel-details/payment-policies/taxes/TaxItemActionFactory';

import _ = require('underscore');

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

	public getHotelAddPaymentsPoliciesDO(dataBuilder: DefaultDataBuilder): HotelAddPaymentsPoliciesDO {
		var paymentMethodIdList: string[] = this.getPaymentMethodIdListFromPaymentMethodList(dataBuilder.paymentMethodList);

		return {
			ccyCode: "EUR",
			paymentMethodIdList: paymentMethodIdList,
			taxes: {
				vatList: [
					{
						name: "VAT",
						value: 0.8
					}
				],
				otherTaxList: [
					{
						type: TaxType.Fixed,
						name: "City Tax",
						value: 10
					}
				]
			}
		}
	}
	public getPaymentMethodIdListFromPaymentMethodList(paymentMethodList: PaymentMethodDO[]): string[] {
		var paymentMethodIdList: string[] = _.map(paymentMethodList, (paymentMethod: PaymentMethodDO) => {
			return paymentMethod.id;
		});
		return paymentMethodIdList;
	}
	public getInvalidOtherTaxDO(): HotelAddPaymentsPoliciesOtherTaxDO {
		return {
			type: TaxType.Percentage,
			name: "Bed VAT",
			value: 10
		};
	}
	public getHotelSaveTaxItemDO(itemType: TaxItemType, taxObject: Object): HotelSaveTaxItemDO {
		return {
			itemType: itemType,
			taxObject: taxObject
		}
	}

}