import { ATransactionalMongoPatch } from '../utils/ATransactionalMongoPatch';
import { P0_CreateUniqueIndexes } from './list/P0_CreateUniqueIndexes';
import { P1_PopulateCountriesAndCurrencyCodes } from './list/P1_PopulateCountriesAndCurrencyCodes';
import { P2_AddCreationDateUtcTimestampToBookings } from "./list/P2_AddCreationDateUtcTimestampToBookings";
import { P3_AddTravelActivityTypeToBookings } from "./list/P3_AddTravelActivityTypeToBookings";
import { P4_AddTravelTypeToBookings } from "./list/P4_AddTravelTypeToBookings";
import { P5_ChangeReservedAddOnProductListStructureForBookings } from "./list/P5_ChangeReservedAddOnProductListStructureForBookings";
import { P6_AddPaymentDueInDaysToHotels } from "./list/P6_AddPaymentDueInDaysToHotels";
import { P7_AddIndexForBookingsSort } from "./list/P7_AddIndexForBookingsSort";
import { P8_AddSignupCodes } from "./list/P8_AddSignupCodes";
import { P9_AddMergeInvoiceToBookings } from "./list/P9_AddMergeInvoiceToBookings";
import { P10_MigrateInvoiceGroupsToInvoices } from './list/P10_MigrateInvoiceGroupsToInvoices';
import { P11_AddBookingsIndexForYMPerformance } from "./list/P11_AddBookingsIndexForYMPerformance";
import { P12_UpdateBookingsGuaranteedTime } from './list/P12_UpdateBookingsGuaranteedTime';
import { P13_AddReservedAddOnProductSnapshotsOnBookings } from './list/P13_AddReservedAddOnProductSnapshotsOnBookings';
import { P14_FixIncorrectCreditInvoices } from './list/P14_FixIncorrectCreditInvoices';
import { P15_AddDecimalsNoInCurrencies } from "./list/P15_AddDecimalsNoInCurrencies";

export class MongoPatchUtils {
    public static get PatchList(): ATransactionalMongoPatch[] {
        return [
            new P0_CreateUniqueIndexes(),
            new P1_PopulateCountriesAndCurrencyCodes(),
            new P2_AddCreationDateUtcTimestampToBookings(),
            new P3_AddTravelActivityTypeToBookings(),
            new P4_AddTravelTypeToBookings(),
            new P5_ChangeReservedAddOnProductListStructureForBookings(),
            new P6_AddPaymentDueInDaysToHotels(),
            new P7_AddIndexForBookingsSort(),
            new P8_AddSignupCodes(),
            new P9_AddMergeInvoiceToBookings(),
            new P10_MigrateInvoiceGroupsToInvoices(),
            new P11_AddBookingsIndexForYMPerformance(),
            new P12_UpdateBookingsGuaranteedTime(),
            new P13_AddReservedAddOnProductSnapshotsOnBookings(),
            new P14_FixIncorrectCreditInvoices(),
            new P15_AddDecimalsNoInCurrencies(),

        ];
    }
}
