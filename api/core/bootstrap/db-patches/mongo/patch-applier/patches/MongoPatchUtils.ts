import { ATransactionalMongoPatch } from '../utils/ATransactionalMongoPatch';
import { P0_CreateUniqueIndexes } from './list/P0_CreateUniqueIndexes';
import { P1_PopulateCountriesAndCurrencyCodes } from './list/P1_PopulateCountriesAndCurrencyCodes';
import { P2_AddCreationDateUtcTimestampToBookings } from "./list/P2_AddCreationDateUtcTimestampToBookings";
import { P3_AddTravelActivityTypeToBookings } from "./list/P3_AddTravelActivityTypeToBookings";

export class MongoPatchUtils {
	public static get PatchList(): ATransactionalMongoPatch[] {
		return [
			new P0_CreateUniqueIndexes(),
			new P1_PopulateCountriesAndCurrencyCodes(),
			new P2_AddCreationDateUtcTimestampToBookings(),
			new P3_AddTravelActivityTypeToBookings(),

		];
	}
}