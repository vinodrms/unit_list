export enum MongoPatchType {
    CreateUniqueIndexes,
    PopulateCountriesAndCurrencyCodes,
    AddCreationDateUtcTimestampToBookings,
    AddTravelActivityTypeToBookings,
    AddTravelTypeToBookings,
    ChangeReservedAddOnProductListStructureForBookings,
    AddPaymentDueInDaysToHotels,
    AddIndexForBookingsSort,
}