export enum MongoPatchType {
    CreateUniqueIndexes,
    PopulateCountriesAndCurrencyCodes,
    SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts,
    AddMaxNoBabiesAttributeOnBeds,
    SetTheNoBabyBedsOnBookingsCapacity,
    AddTheRoomPricePerNightListOnBookingPrice,
    AddAppliedDiscountValueOnBookingPrice,
    AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails,
    SetValueForFirstChildWithAdultInSharedBedPriceOnBookingsPriceProductSnapshots,
    SetInitialValuesForBookingReferenceSequencesOnHotel,
    AddDynamicPricesOnPriceProducts,
    AddDynamicPriceIdsOnBookingPrice,
    AddDeductedOnCustomerCommissions,
    AddDeductedCommissionPriceAndEmptyCommissionOnBookingPrice,
    AddEmptyIntervalListOnPriceProductDiscounts,
    EncapsulateDiscountInBookingPricePerDayOnBookings,
    TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList,
    AddTransactionFeeSnapshotOnInvoicePayers,
    AddIdOnInvoices,
    AddInvoiceAccountingTypeDebitOnInvoices,
    AddInvoiceItemAccountingTypeDebitOnInvoices,
    
}