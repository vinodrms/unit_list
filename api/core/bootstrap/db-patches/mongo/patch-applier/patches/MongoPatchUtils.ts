import { ATransactionalMongoPatch } from '../utils/ATransactionalMongoPatch';
import { P0_CreateUniqueIndexes } from './list/P0_CreateUniqueIndexes';
import { P1_PopulateCountriesAndCurrencyCodes } from './list/P1_PopulateCountriesAndCurrencyCodes';
import { P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts } from './list/P2_SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts';
import { P3_AddMaxNoBabiesAttributeOnBeds } from './list/P3_AddMaxNoBabiesAttributeOnBeds';
import { P4_SetTheNoBabyBedsOnBookingsCapacity } from './list/P4_SetTheNoBabyBedsOnBookingsCapacity';
import { P5_AddTheRoomPricePerNightListOnBookingPrice } from './list/P5_AddTheRoomPricePerNightListOnBookingPrice';
import { P6_AddAppliedDiscountValueOnBookingPrice } from './list/P6_AddAppliedDiscountValueOnBookingPrice';
import { P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails } from "./list/P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails";
import { P8_AddDynamicPricesOnPriceProducts } from "./list/P8_AddDynamicPricesOnPriceProducts";
import { P9_AddDynamicPriceIdsOnBookingPrice } from "./list/P9_AddDynamicPriceIdsOnBookingPrice";

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
			new P8_AddDynamicPricesOnPriceProducts(),
			new P9_AddDynamicPriceIdsOnBookingPrice(),

		];
	}
}