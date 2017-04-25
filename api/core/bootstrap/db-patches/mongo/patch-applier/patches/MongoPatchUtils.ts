import { ATransactionalMongoPatch } from '../utils/ATransactionalMongoPatch';
import { P0_CreateUniqueIndexes } from './list/P0_CreateUniqueIndexes';
import { P1_PopulateCountriesAndCurrencyCodes } from './list/P1_PopulateCountriesAndCurrencyCodes';
import { P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts } from './list/P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts';
import { P3_AddMaxNoBabiesAttributeOnBeds } from './list/P3_AddMaxNoBabiesAttributeOnBeds';
import { P4_SetTheNoBabyBedsOnBookingsCapacity } from './list/P4_SetTheNoBabyBedsOnBookingsCapacity';
import { P5_AddTheRoomPricePerNightListOnBookingPrice } from './list/P5_AddTheRoomPricePerNightListOnBookingPrice';
import { P6_AddAppliedDiscountValueOnBookingPrice } from './list/P6_AddAppliedDiscountValueOnBookingPrice';
import { P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails } from "./list/P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails";
import { P8_SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots } from "./list/P8_SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots";
import { P9_SetInitialValuesForBookingReferenceSequencesOnHotel } from "./list/P9_SetInitialValuesForBookingReferenceSequencesOnHotel";
import { P10_AddDynamicPricesOnPriceProducts } from "./list/P10_AddDynamicPricesOnPriceProducts";
import { P11_AddDynamicPriceIdsOnBookingPrice } from "./list/P11_AddDynamicPriceIdsOnBookingPrice";
import { P12_AddDeductedOnCustomerCommissions } from "./list/P12_AddDeductedOnCustomerCommissions";
import { P13_AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice } from "./list/P13_AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice";
import { P14_AddEmptyIntervalListOnPriceProductDiscounts } from "./list/P14_AddEmptyIntervalListOnPriceProductDiscounts";
import { P15_EncapsulateDiscountInBookingPricePerDayOnBookings } from "./list/P15_EncapsulateDiscountInBookingPricePerDayOnBookings";
import { P16_TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList } from "./list/P16_TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList";
import { P17_AddTransactionFeeSnapshotOnInvoicePayers } from "./list/P17_AddTransactionFeeSnapshotOnInvoicePayers";
import { P18_CreateContactDetailsListOnCustomerDetails } from "./list/P18_CreateContactDetailsListOnCustomerDetails";

export class MongoPatchUtils {
	public static get PatchList(): ATransactionalMongoPatch[] {
		return [
			new P0_CreateUniqueIndexes(),
			new P1_PopulateCountriesAndCurrencyCodes(),
			new P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts(),
			new P3_AddMaxNoBabiesAttributeOnBeds(),
			new P4_SetTheNoBabyBedsOnBookingsCapacity(),
			new P5_AddTheRoomPricePerNightListOnBookingPrice(),
			new P6_AddAppliedDiscountValueOnBookingPrice(),
			new P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails(),
			new P8_SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots(),
			new P9_SetInitialValuesForBookingReferenceSequencesOnHotel(),
			new P10_AddDynamicPricesOnPriceProducts(),
			new P11_AddDynamicPriceIdsOnBookingPrice(),
			new P12_AddDeductedOnCustomerCommissions(),
			new P13_AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice(),
			new P14_AddEmptyIntervalListOnPriceProductDiscounts(),
			new P15_EncapsulateDiscountInBookingPricePerDayOnBookings(),
			new P16_TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList(),
			new P17_AddTransactionFeeSnapshotOnInvoicePayers(),
			new P18_CreateContactDetailsListOnCustomerDetails(),
			
		];
	}
}