import {Locales, ThTranslation} from '../localization/ThTranslation';
import {ThUtils} from '../ThUtils';

export enum ThStatusCode {
    Ok,
    InternalServerError,
    DataValidationError,
    DataEmailValidationError,
    DataPasswordValidationError,
    ErrorBootstrappingApp,
    ErrorCleaningRepositories,
    InvalidRequestParameters,
    VatProviderErrorCheckingVat,
    VatProviderNotInEu,
    VatProviderInvalidVat,
    VatProviderInvalidCountryCode,
    VatProviderProxyServiceNonEuCountry,
    TimezoneServiceErrorGettingAvailableTZs,
    EmailTemplateBuilderProblemFindingTemplatesDirectory,
    EmailTemplateBuilderProblemBuildingContent,
    SendGridServiceErrorSendingEmail,
    HotelSignUpError,
    HotelRepositoryAccountAlreadyExists,
    HotelRepositoryErrorAddingHotel,
    HotelLoginError,
    PassportLoginServiceInvalidLogin,
    PassportLoginServiceErrorInvalidLogin,
    HotelRepositoryErrorFindingAccount,
    HotelRepositoryAccountNotFound,
    HotelAuthenticationAccountNotActive,
    HotelAuthenticationErrorQueryingRepository,
    HotelAuthenticationInvalidEmailOrPassword,
    HotelRepositoryErrorActivatingAccount,
    UserAccountActivationErrorActivatingAccount,
    HotelRepositoryAccountCouldNotBeActivated,
    HotelActivateError,
    AccControllerErrorInitializingSession,
    SessionManagerErrorInitializingSession,
    HotelRepositoryProblemUpdatingPasswordToken,
    HotelRepositoryErrorUpdatingPasswordToken,
    UserAccountRequestResetPasswordError,
    AccControllerErrorRequestingResetPassword,
    HotelRepositoryCouldNotResetPassword,
    HotelRepositoryErrorCouldNotResetPassword,
    UserAccountResetPasswordError,
    AccControllerErrorResettingPassword,
    ImageStorageServiceErrorUploadingImage,
    CloudinaryImageStorageServiceErrorUploadingImage,
    ImageUploadControllerErrorUploadingImage,
    ImageUploadControllerNoFilesToUpload,
    ImageUploadControllerGenericError,
    SettingsRepositoryAddDuplicateKeyError,
    SettingsRepositoryAddError,
    SettingsMongoRepositoryReadError,
    SettingsRepositoryNotFound,
    RepositoryGetNetiveEntityError,
    PatchErrorEnsuringUniqueIndexOnSettings,
    HotelGetDetailsError,
    HotelGetDetailsErrorFormattingResponse,
    HotelGetDetailsErrorFindingUserByEmail,
    HotelConfigurationsErrorMarkingAsCompleted,
    HotelDetailsControllerErrorGettingDetails,
    HotelDetailsControllerErrorUpdatingBasicInfo,
    HotelDetailsControllerErrorAddingPaymentsAndPolicies,
    HotelDetailsControllerErrorUpdatingPaymentMethods,
    HotelDetailsControllerErrorSavingTaxItem,
    HotelRepositoryHotelIdNotFound,
    HotelRepositoryErrorFindingHotelById,
    HotelDetailsRepositoryProblemUpdatingAccount,
    HotelDetailsRepositoryErrorUpdatingAccount,
    PaymentMethodIdListValidatorInvalid,
    PaymentMethodIdListValidatorError,
    HotelAddPaymentsPoliciesErrorPrecheckingConstraints,
    HotelAddPaymentPoliciesInvalidTaxes,
    HotelAddPaymentsPoliciesError,
    HotelAddPaymentPoliciesInvalidCurrencyCode,
    RoomRepositoryErrorGettingRoomList,
    RoomRepositoryErrorGettingRoom,
    RoomRepositoryRoomNotFound,
    RoomRepositoryErrorReadingCategoryIdList,
    RoomRepositoryNameAlreadyExists,
    RoomRepositoryErrorUpdatingRoom,
    RoomItemUpdateStrategyErrorUpdating,
    RoomRepositoryProblemUpdatingRoom,
    RoomRepositoryErrorAddingRoom,
    RoomRepositoryErrorReadingDocumentCount,
    SaveRoomItemError,
    DeleteRoomItemError,
    RoomsControllerErrorGettingRooms,
    RoomsControllerErrorSavingRoom,
    RoomsControllerErrorDeletingRoom,
    RoomsControllerErrorGettingRoomById,
    RoomsControllerErrorGettingRoomCategories,
    RoomsControllerErrorGettingCount,
    SaveRoomItemInvalidCategoryId,
    SaveRoomItemInvalidAmenityList,
    SaveRoomItemInvalidAttributeList,
    SaveRoomItemInvalidBedList,
    RoomAggregatorGetUsedCategoriesError,
    RoomAggregatorCategoryStatsListInvalidCatgoryIdListError,
    RoomAggregatorCategoryStatsListError,
    RoomAggregatorGetRoomsByCategoryIdListError,
    RoomAggregatorCategoryStatsError,
    RoomAggregatorRoomStatsError,
    RoomCategoryRepositoryErrorGettingRoomCategoryList,
    RoomCategoryRepositoryErrorGettingRoomCategory,
    RoomCategoryRepositoryNameAlreadyExists,
    RoomCategoryRepositoryErrorAddingRoomCategory,
    RoomCategoryRepositoryRoomCategoryNotFound,
    RoomCategoryRepositoryErrorGettingRoom,
    RoomCategoryRepositoryProblemUpdatingRoomCategory,
    RoomCategoryRepositoryErrorUpdatingRoomCategory,
    RoomCategoryItemUpdateStrategyErrorUpdating,
    SaveRoomCategoryItemError,
    DeleteRoomCategoryItemError,
    RoomCategoriesControllerErrorSavingRoomCategory,
    RoomCategoriesControllerErrorDeletingRoomCategory,
    RoomCategoriesControllerErrorGettingRoomCategoryById,
    RoomCategoriesControllerErrorGettingRoomCategoriesStats,
    RoomCategoriesControllerErrorGettingUsedRoomCategoriesStats,
    BedRepositoryErrorGettingBedList,
    BedRepositoryErrorGettingBed,
    BedRepositoryBedNotFound,
    BedRepositoryErrorAddingBed,
    BedRepositoryNameAlreadyExists,
    BedRepositoryErrorUpdatingBed,
    BedRepositoryErrorReadingDocumentCount,
    BedItemUpdateStrategyErrorUpdating,
    SaveBedItemError,
    SaveBedItemInvalidSizeAndOrCapacity,
    SaveBedItemInvalidBedTemplateId,
    DeleteBedItemErrorDeleting,
    DeleteBedItemErrorValidating,
    DeleteBedItemError,
    DeleteBedItemErrorUsedInRoomCategories,
    BedControllerErrorGettingBeds,
    BedControllerErrorSavingBed,
    BedControllerErrorDeletingBed,
    BedControllerErrorGettingBedById,
    BedsControllerErrorGettingCount,
    HotelUpdatePaymentsPoliciesErrorPrecheckingConstraints,
    HotelUpdatePaymentPoliciesInvalidTaxes,
    HotelUpdatePaymentsPoliciesError,
    HotelUpdatePaymentPoliciesInvalidCurrencyCode,
    HotelSaveTaxItemError,
    HotelSaveTaxItemValidationProblem,
    TaxItemUpdateStrategyErrorUpdating,
    HotelUpdatePropertyDetailsUpdateError,
    HotelUpdatePropertyDetailsValidationError,
    HotelUpdatePropertyDetailsInvalidAmenityIdList,
    HotelUpdatePropertyDetailsInvalidOperationHours,
    HotelUpdatePropertyDetailsInvalidTimezone,
    HotelDetailsControllerErrorUpdatingPropertyDetails,
    TaxRepositoryErrorGettingTaxList,
    TaxRepositoryErrorGettingTax,
    TaxRepositoryNameAlreadyExists,
    TaxRepositoryErrorAddingTax,
    TaxRepositoryProblemUpdatingTax,
    TaxRepositoryErrorUpdatingTax,
    TaxRepositoryTaxNotFound,
    HotelDeleteTaxItemError,
    HotelDeleteTaxItemErrorDeleting,
    HotelDeleteTaxItemErrorValidating,
    HotelDeleteTaxItemUsedInAddOnProducts,
    HotelDeleteTaxItemUsedInDraftOrActivePriceProducts,
    TaxControllerErrorGettingTaxes,
    TaxControllerErrorSavingTax,
    TaxControllerErrorDeletingTax,
    AddOnProductRepositoryProblemUpdatingAddOnProduct,
    AddOnProductRepositoryErrorUpdatingAddOnProduct,
    AddOnProductRepositoryNameAlreadyExists,
    AddOnProductRepositoryErrorAddingAddOnProduct,
    AddOnProductRepositoryProductNotFound,
    AddOnProductRepositoryErrorGettingAddOnProduct,
    AddOnProductRepositoryErrorReadingCategoryIdList,
    AddOnProductRepositoryErrorReadingDocumentCount,
    AddOnProductRepositoryErrorGettingList,
    SaveAddOnProductItemError,
    SaveAddOnProductItemInvalidCategoryId,
    TaxIdValidatorInvalidTaxId,
    AddOnProductItemUpdateStrategyErrorUpdating,
    DeleteAddOnProductItemError,
    DeleteAddOnProductItemErrorValidating,
    DeleteAddOnProductItemUsedInDraftOrActivePriceProducts,
    AddOnProductsControllerErrorGettingAddOnProduct,
    AddOnProductsControllerErrorSavingAddOnProduct,
    AddOnProductsControllerErrorDeletingAddOnProduct,
    AddOnProductsControllerErrorGettingCategoryIdList,
    AddOnProductsControllerErrorGettingCount,
    AddOnProductsControllerErrorGettingList,
    AddOnProductIdValidatorInvalidId,
    CustomerRepositoryCustomerNotFound,
    CustomerRepositoryErrorGettingCustomer,
    CustomerRepositoryErrorCreatingCustomer,
    CustomerRepositoryProblemUpdatingCustomer,
    CustomerRepositoryErrorUpdatingCustomer,
    CustomerRepositoryErrorReadingCustomerCount,
    CustomerRepositoryErrorGettingList,
    SaveCustomerItemError,
    SaveCustomerItemInvalidOrNullClientType,
    SaveCustomerItemCompOrTACannotBeLinkedToOtherCustomers,
    CustomerIdValidatorInvalidId,
    CustomerItemUpdateStrategyError,
    CustomerItemUpdateStrategyCustTypeChanged,
    CustomerItemUpdateStrategyPriceProductUsedInAllotment,
    CustomersControllerErrorGettingCustomer,
    CustomersControllerErrorSavingCustomer,
    CustomersControllerErrorGettingCount,
    CustomersControllerErrorGettingList,
    PriceProductRepositoryErrorAddingPriceProduct,
    PriceProductRepositoryProductNotFound,
    PriceProductRepositoryErrorGettingPriceProduct,
    PriceProductRepositoryProblemUpdatingPriceProduct,
    PriceProductRepositoryErrorUpdatingPriceProduct,
    PriceProductRepositoryErrorReadingDocumentCount,
    PriceProductRepositoryErrorGettingList,
    SavePriceProductItemError,
    SavePriceProductItemInvalidPrice,
    SavePriceProductItemInvalidConstraints,
    SavePriceProductItemInvalidConditions,
    PriceProductItemUpdateStrategyOnlyActiveAndDraftCanBeUpdated,
    PriceProductItemStrategyInvalidStatus,
    PriceProductValidatorUnusedRoomCategoryId,
    PriceProductValidatorEmptyRoomCategoryList,
    PriceProductValidatorInvalidPrices,
    ArchivePriceProductItemError,
    ArchivePriceProductItemNonActiveStatus,
    ArchivePriceProductItemUsedInCustomersError,
    UpdatePriceProductItemStatusError,
    UpdatePriceProductItemStatusWrongStatus,
    DraftPriceProductItemOnlyArchived,
    DraftPriceProductItemError,
    PriceProductsYieldManagementInvalidInterval,
    PriceProductIdValidatorInvalidId,
    PriceProductsControllerErrorGettingPriceProduct,
    PriceProductsControllerErrorSavingPriceProduct,
    PriceProductsControllerErrorDeletingPriceProduct,
    PriceProductsControllerErrorMarkingPriceProductAsDraft,
    PriceProductsControllerErrorArchivingProduct,
    PriceProductsControllerErrorGettingCount,
    PriceProductsControllerErrorGettingList,
    PricePerPersonForSingleRoomCategoryDOInvalidPriceConfiguration,
    YieldManagerControllerErrorClosing,
    YieldManagerControllerErrorOpening,
    HotelConfigurationRepositoryNotFound,
    HotelConfigurationRepositoryReadError,
    HotelConfigurationRepositoryErrorAddingConfiguration,
    HotelConfigurationRepositoryAlreadyExists,
    HotelConfigurationRepositoryProblemUpdatingConfiguration,
    HotelConfigurationRepositoryErrorUpdatingConfiguration,
    YieldFilterValidatorInvalidFilters,
    HotelConfigurationControlllerErrorGettingYieldFilterConfig,
    HotelConfigurationControlllerErrorSavingYieldFilterValue,
    SaveYieldFilterValueError,
    YieldFilterRepositoryErrorGettingYieldFilter,
    YieldFilterRepositoryErrorGettingYieldFilterValue,
    YieldFilterRepositoryErrorAddingYieldFilterValue,
    YieldFilterRepositoryErrorUpdatingYieldFilterValue,
    YieldFilterRepositoryErrorDuplicateFilterValue,
    YieldFilterRepositoryErrorLabelOrColorCodeInvalid,
    AllotmentRepositoryErrorAddingAllotment,
    AllotmentRepositoryAllotmentNotFound,
    AllotmentRepositoryErrorGettingAllotment,
    AllotmentRepositoryProblemUpdatingAllotment,
    AllotmentRepositoryErrorUpdatingAllotment,
    AllotmentRepositoryErrorReadingDocumentCount,
    AllotmentRepositoryErrorGettingList,
    SaveAllotmentItemError,
    SaveAllotmentItemInvalidConstraints,
    SaveAllotmentItemInvalidInterval,
    SaveAllotmentItemInvalidIntervalLength,
    SaveAllotmentItemInvalidAvailability,
    AllotmentValidatorInvalidPriceProductId,
    AllotmentValidatorNotActivePriceProduct,
    AllotmentValidatorInvalidRoomCategId,
    AllotmentIdValidatorInvalidId,
    ArchiveAllotmentItemError,
    ArchiveAllotmentItemNotActiveAllotment,
    AllotmentsControllerErrorGettingAllotment,
    AllotmentsControllerErrorSavingAllotment,
    AllotmentsControllerErrorArchivingAllotment,
    AllotmentsControllerErrorGettingCount,
    AllotmentsControllerErrorGettingList,
    HotelDetailsRepositoryErrorGettingList,
    HotelIteratorError,
    AllotmentArchiverCronJobExecutorError,

    // Notifications
    NotificationsRepositoryErrorAddingNotification,
    NotificationsRepositoryErrorGettingCount,
    NotificationsRepositoryErrorGettingList,
    NotificationsRepositoryErrorGettingUndelivered,
    NotificationsRepositoryErrorMarkingAsRead,

    //Pdf report service
    PdfReportServiceErrorCreatingOutputFolder,
    PdfReportServiceErrorWritingHtmlToFile,
    PdfReportServiceHtmlToPdfError,
    PhantomHtmlToPdfConverter,

    GeneratInvoiceGroupActionFactoryError,
    GenerateBookingInvoiceError,
    GenerateBookingInvoiceErrorBuildingDefaultInvoice,
    InvoiceGroupsRepositoryErrorAddingInvoiceGroup,
    InvoiceGroupsRepositoryProblemUpdatingInvoiceGroup,
    InvoiceGroupsRepositoryErrorUpdatingInvoiceGroup,
    InvoiceGroupsRepositoryErrorGettingInvoiceGroupList,
    InvoiceGroupsItemUpdateStrategyErrorUpdating,
    InvoiceGroupsRepositoryInvoiceGroupNotFound,
    InvoiceGroupsRepositoryErrorGettingInvoiceGroup,
    InvoiceGroupsRepositoryErrorReadingDocumentCount,
    InvoiceGroupsControllerErrorGettingInvoiceGroupById,
    InvoiceGroupsControllerErrorGettingInvoiceGroups,
    InvoiceGroupsRepositoryErrorGettingInvoice,
    InvoiceGroupsControllerErrorGettingInvoiceGroupsCount,
    InvoiceGroupsControllerErrorGettingInvoiceGroupsBrief,
    InvoiceGroupsBriefDataAggregatorErrorGettingInvoiceGroupsBrief,
    SaveInvoiceGroupItem,
    SaveInvoiceGroupError,
    InvoicePaymentMethodValidatorError,
    InvoicePaymentMethodValidatorInvalidPaymentMethod,
    InvoicePaymentMethodValidatorUnsupportedPaymentMethod,
    InvoicePaymentMethodValidatorCannotPayByAgreement,
    InvoicePaymentValidatorError,
    InvoicePayersValidatorError,
    InvoicePayersValidatorInvalidSplit,
    GetInvoiceGroupBriefDataError,
    CustomerInvoiceGroupUpdateStrategyErrorUpdating,
    CustomerInvoiceGroupAddStrategyErrorAdding,
    BookingInvoiceGroupUpdateStrategyErrorUpdating,
    InvoiceGroupsRepositoryBookingPriceLinkError,
    InvoiceEmailSenderErrorSendingEmail,

    SlackSendMessageError,

    AddBookingsRepositoryEmptyBookingList,
    AddBookingsRepositoryNoBookingsLimitExceeded,
    AddBookingsRepositoryErrorAddingBookingGroup,
    AddBookingItemsError,
    BookingIntervalValidatorError,
    BookingIntervalValidatorInvalidInterval,
    BookingIntervalValidatorInvalidStartDate,
    BookingIntervalValidatorMaxSixMonths,
    AddBookingItemsInvalidNoOfBookings,
    BookingItemsConverterError,
    BookingValidationError,
    BookingsValidatorBillingCustomerMissing,
    BookingsValidatorYieldingClosed,
    BookingsValidatorAllotmentCustomer,
    BookingsValidatorAllotmentInvalidRoomCategory,
    BookingsValidatorMissingPaymentGuarantee,
    BookingsValidatorNoCompaniesOrTALimit,
    BookingsValidatorBilledCustomerInvalidRightsOnPriceProduct,
    BookingsValidatorConstraintsDoNotApply,
    BookingsValidatorAllotmentConstraintsDoNotApply,
    BookingsValidatorInvalidRoomCategoryId,
    BookingsValidatorInvalidBookingCapacity,
    BookingsValidatorInvalidPriceForRoomCategoryId,
    BookingsValidatorInvalidRoomId,
    BookingsValidatorRoomCategoryNotFoundInActiveInventory,
    BookingsValidatorInsufficientRoomCategoryCapacity,
    BookingsRepositoryProblemUpdatingBooking,
    BookingsRepositoryErrorUpdatingBooking,
    BookingsRepositoryErrorGettingList,
    BookingRepositoryErrorReadingDocumentCount,
    BookingRepositoryBookingNotFound,
    BookingRepositoryErrorGettingBooking,
    BookingConfirmationErrorGettingData,
    BookingConfirmationEmailSenderErrorSendingEmail,
    BookingSearchError,
    RoomInventoryAggregatorError,
    BookingOccupancyCalculatorError,
    BookingOccupancyCalculatorErrorIndexing,
    BookingDependenciesFilterError,
    BookingsValidatorAllotmentInsufficientInventory,
    SearchResultBuilderError,
    BookingsValidatorAllotmentOpenIntervalMismatch,
    BookingsControllerErrorGettingBookingById,
    BookingsControllerErrorGettingBookings,
    BookingsControllerErrorGettingCount,
    BookingsControllerErrorSearchingBookings,
    BookingsControllerErrorAddingBookings,
    BookingStatusChangerCronJobExecutorError,
    HotelTimeNullTimezone,
    HotelTimeError,
    HotelOperationsRoomInfoReaderError,
    HotelOperationsArrivalsReaderError,
    HotelOperationsDeparturesReaderError,
    AssignRoomError,
    AssignRoomOccupied,
    AssignRoomCheckedInWrongInterval,
    AssignRoomPaidInvoice,
    ChangeRoomStrategyOnlyWhenCheckedIn,
    ChangeRoomStrategyEndDateInPast,
    CheckInStrategyOnlyConfirmedOrGuaranteed,
    CheckInStrategyNoPaymentGuarantee,
    CheckInStrategyStartDateInFuture,
    CheckInStrategyEndDateInPast,
    ReserveRoomStrategyOnlyConfirmedOrGuaranteed,
    ReserveRoomStrategyEndDateInPast,
    CheckOutRoomError,
    CheckOutRoomBookingNotCheckedIn,
    HotelOperationsDashboardControllerErrorGettingArrivals,
    HotelOperationsDashboardControllerErrorGettingDepartures,
    HotelOperationsDashboardControllerErrorGettingRooms,
    HotelRoomOperationsControllerErrorCheckingIn,
    HotelRoomOperationsControllerErrorCheckingOut,
    HotelRoomOperationsControllerErrorReservingRoom,
    HotelRoomOperationsControllerErrorChangingRoom,
    BookingOccupancyCalculatorWrapperError,
    BookingOccupancyCalculatorWrapperInvalidInterval,
    BookingPossiblePricesError,
    HotelBookingOperationsControllerErrorGettingPossiblePrices,
    MarkOccupiedRoomsAsDirtyCronJobExecutorError,
    ChangeRoomMaintenanceStatusError,
    HotelRoomOperationsControllerErrorChangingMaintenanceStatus,
    RoomAttachedBookingError,
    HotelRoomOperationsControllerErrorGettingAttachedBooking,
    BookingWithDependenciesLoaderError,
    BookingChangeDatesError,
    BookingChangeDatesInvalidState,
    BookingChangeDatesPaidInvoice,
    HotelBookingOperationsControllerErrorChangingDates,
    BookingChangeNoShowTimeError,
    BookingChangeNoShowTimeInvalidTime,
    BookingChangeNoShowTimeInvalidState,
    HotelBookingOperationsControllerErrorChangingNoShowTime,
    BookingChangeCapacityInvalidState,
    BookingChangeCapacityPaidInvoice,
    BookingChangeCapacityError,
    HotelBookingOperationsControllerErrorChangingCapacity,
    BookingPaymentGuaranteeError,
    BookingPaymentGuaranteeInvalidState,
    HotelBookingOperationsControllerErrorAddingPaymentGuarantee,
    BookingChangeDetailsInvalidState,
    BookingChangeDetailsError,
    HotelBookingOperationsControllerErrorChangingDetails,
    BookingChangeCustomersInvalidState,
    BookingChangeCustomersError,
    BookingChangeCustomersBilledCustomerMisssing,
    HotelBookingOperationsControllerErrorChangingCustomers,
    BookingCancelInvalidState,
    BookingCancelError,
    BookingReactivateInvalidState,
    BookingReactivateEndDateInThePast,
    BookingReactivatePaidInvoice,
    BookingReactivateError,
    HotelBookingOperationsControllerErrorCancelling,
    HotelBookingOperationsControllerErrorReactivating,
    EmailConfirmationError,
    HotelCommonOperationsControllerEmailError,
    BookingRemoveRollawayCapacityWarningError,
    HotelBookingOperationsControllerErrorRemovingRollawayCapacity,
    PriceProductReaderInvalidInterval,
    PriceProductReaderError,
    YieldManagerControllerErrorGettingYieldItems,
    BookingReserveAddOnProductsInvalidState,
    BookingReserveAddOnProductsError,
    HotelBookingOperationsControllerErrorReservingAddOnProducts,
    MongoHotelInventorySnapshotRepositoryDuplicate,
    MongoHotelInventorySnapshotRepositoryError,
    MongoHotelInventorySnapshotRepositoryErrorGettingSnapshots,
    HotelInventorySnapshotCronJobExecutorError,

}

var ThMessage: { [index: number]: string; } = {};
ThMessage[ThStatusCode.Ok] = "Ok";
ThMessage[ThStatusCode.InternalServerError] = "Internal Server Error.";
ThMessage[ThStatusCode.DataValidationError] = "Error validating data.";
ThMessage[ThStatusCode.DataEmailValidationError] = "Error validating email.";
ThMessage[ThStatusCode.DataPasswordValidationError] = "Error validating password.";
ThMessage[ThStatusCode.ErrorBootstrappingApp] = "Error Bootstrapping App.";
ThMessage[ThStatusCode.ErrorCleaningRepositories] = "Error Cleaning Repositories.";
ThMessage[ThStatusCode.InvalidRequestParameters] = "Invalid Request Parameters.";
ThMessage[ThStatusCode.VatProviderErrorCheckingVat] = "Error checking VAT number.";
ThMessage[ThStatusCode.VatProviderNotInEu] = "The VAT is not in EU";
ThMessage[ThStatusCode.VatProviderInvalidVat] = "Invalid VAT number.";
ThMessage[ThStatusCode.VatProviderInvalidCountryCode] = "Invalid country code";
ThMessage[ThStatusCode.VatProviderProxyServiceNonEuCountry] = "Non EU Country";
ThMessage[ThStatusCode.TimezoneServiceErrorGettingAvailableTZs] = "Error getting available timezones";
ThMessage[ThStatusCode.EmailTemplateBuilderProblemFindingTemplatesDirectory] = "Error sending email: the content was not found on the server. Please contact the Administrator.";
ThMessage[ThStatusCode.EmailTemplateBuilderProblemBuildingContent] = "Error sending email: problem building content. Please contact the Administrator.";
ThMessage[ThStatusCode.SendGridServiceErrorSendingEmail] = "Error sending email. Please contact the Administrator.";
ThMessage[ThStatusCode.HotelSignUpError] = "Error signing up. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryAccountAlreadyExists] = "An account with this email already exists.";
ThMessage[ThStatusCode.HotelRepositoryErrorAddingHotel] = "Error adding the information. Please try again.";
ThMessage[ThStatusCode.HotelLoginError] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.PassportLoginServiceInvalidLogin] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.PassportLoginServiceErrorInvalidLogin] = "Error signing in. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorFindingAccount] = "Error finding account. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryAccountNotFound] = "Invalid email or password.";
ThMessage[ThStatusCode.HotelAuthenticationAccountNotActive] = "The account is not active.";
ThMessage[ThStatusCode.HotelAuthenticationErrorQueryingRepository] = "Error logging in. Please check your credentials and try again.";
ThMessage[ThStatusCode.HotelAuthenticationInvalidEmailOrPassword] = "Invalid email or password.";
ThMessage[ThStatusCode.HotelRepositoryErrorActivatingAccount] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.UserAccountActivationErrorActivatingAccount] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.HotelRepositoryAccountCouldNotBeActivated] = "The account could not be activated.";
ThMessage[ThStatusCode.HotelActivateError] = "There was a problem while activating your account.";
ThMessage[ThStatusCode.AccControllerErrorInitializingSession] = "There was a problem while creating your session. Please try again.";
ThMessage[ThStatusCode.SessionManagerErrorInitializingSession] = "There was a problem while creating your session. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryProblemUpdatingPasswordToken] = "The password could not be reset. Please check the email and try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorUpdatingPasswordToken] = "There was a problem while resetting the password.";
ThMessage[ThStatusCode.UserAccountRequestResetPasswordError] = "There was a problem while resetting the password. Please contract the administrator if this problem persists.";
ThMessage[ThStatusCode.AccControllerErrorRequestingResetPassword] = "Problem resetting your password.";
ThMessage[ThStatusCode.HotelRepositoryCouldNotResetPassword] = "Problem while updating the new password. The link you used may expired.";
ThMessage[ThStatusCode.HotelRepositoryErrorCouldNotResetPassword] = "Problem while updating the new password.";
ThMessage[ThStatusCode.UserAccountResetPasswordError] = "There was a problem while changing the password. Please contract the administrator if this problem persists.";
ThMessage[ThStatusCode.AccControllerErrorResettingPassword] = "There was a problem while changing the password.";
ThMessage[ThStatusCode.ImageStorageServiceErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.CloudinaryImageStorageServiceErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.ImageUploadControllerErrorUploadingImage] = "There was a problem while uploading the image.";
ThMessage[ThStatusCode.ImageUploadControllerNoFilesToUpload] = "No images sent for the upload.";
ThMessage[ThStatusCode.ImageUploadControllerGenericError] = "Error uploading files. Please check the content and try again.";
ThMessage[ThStatusCode.SettingsRepositoryAddDuplicateKeyError] = "Error inserting setting (duplicate key error).";
ThMessage[ThStatusCode.SettingsRepositoryAddError] = "Error inserting setting.";
ThMessage[ThStatusCode.SettingsMongoRepositoryReadError] = "Error reading system setting.";
ThMessage[ThStatusCode.SettingsRepositoryNotFound] = "Setting not found.";
ThMessage[ThStatusCode.RepositoryGetNetiveEntityError] = "Error getting native entity for collection.";
ThMessage[ThStatusCode.PatchErrorEnsuringUniqueIndexOnSettings] = "Error ensuring unique index on settings collection.";
ThMessage[ThStatusCode.HotelGetDetailsError] = "Error getting details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelGetDetailsErrorFormattingResponse] = "Error updating the details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelGetDetailsErrorFindingUserByEmail] = "Error getting the details for the hotel. Please try again.";
ThMessage[ThStatusCode.HotelConfigurationsErrorMarkingAsCompleted] = "Error marking the configurations as completed.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorGettingDetails] = "Error getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingBasicInfo] = "Error updating the basic information. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorAddingPaymentsAndPolicies] = "Error adding payments and policies. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingPaymentMethods] = "Error updating payment options. Please try again.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorSavingTaxItem] = "Error saving the tax. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryHotelIdNotFound] = "Problem getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelRepositoryErrorFindingHotelById] = "Error getting the details for your hotel. Please try again.";
ThMessage[ThStatusCode.HotelDetailsRepositoryProblemUpdatingAccount] = "Problem updating the hotel's information. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.HotelDetailsRepositoryErrorUpdatingAccount] = "Error updating hotel's information. Please try again.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorInvalid] = "Invalid payment methods submitted.";
ThMessage[ThStatusCode.PaymentMethodIdListValidatorError] = "Error validating payment method id list.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesErrorPrecheckingConstraints] = "There was a problem while checking the payments and policies submitted.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidTaxes] = "Invalid taxes sent.";
ThMessage[ThStatusCode.HotelAddPaymentsPoliciesError] = "Error adding the payments and policies.";
ThMessage[ThStatusCode.HotelAddPaymentPoliciesInvalidCurrencyCode] = "Invalid currency code.";
ThMessage[ThStatusCode.BedRepositoryErrorGettingBedList] = "Error getting the bed list. Please try again.";
ThMessage[ThStatusCode.BedRepositoryErrorGettingBed] = "Error getting the bed. Please try again.";
ThMessage[ThStatusCode.BedRepositoryBedNotFound] = "Bed not found.";
ThMessage[ThStatusCode.BedRepositoryErrorAddingBed] = "An error occurred while adding this bed for the current hotel.";
ThMessage[ThStatusCode.BedRepositoryNameAlreadyExists] = "The name of the bed already exists.";
ThMessage[ThStatusCode.BedRepositoryErrorUpdatingBed] = "Problem updating the bed. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.BedRepositoryErrorReadingDocumentCount] = "Error getting document count.";
ThMessage[ThStatusCode.BedItemUpdateStrategyErrorUpdating] = "Error updating the bed.";
ThMessage[ThStatusCode.SaveBedItemError] = "Error saving the bed item.";
ThMessage[ThStatusCode.SaveBedItemInvalidSizeAndOrCapacity] = "Size and capacity mandatory for Adults/Children and should be null for Babies";
ThMessage[ThStatusCode.SaveBedItemInvalidBedTemplateId] = "Invalid bed template id.";
ThMessage[ThStatusCode.DeleteBedItemErrorDeleting] = "Error deleting bed item.";
ThMessage[ThStatusCode.DeleteBedItemErrorValidating] = "Error validating the existing bed item.";
ThMessage[ThStatusCode.DeleteBedItemErrorUsedInRoomCategories] = "Cannot delete the bed because it was assigned to at least a room category in your inventory.";
ThMessage[ThStatusCode.BedControllerErrorGettingBeds] = "Error getting the beds.";
ThMessage[ThStatusCode.BedControllerErrorSavingBed] = "Error saving bed.";
ThMessage[ThStatusCode.BedControllerErrorDeletingBed] = "Error deleting bed.";
ThMessage[ThStatusCode.BedControllerErrorGettingBedById] = "Error getting bed by id.";
ThMessage[ThStatusCode.BedsControllerErrorGettingCount] = "Error getting the number of beds.";
ThMessage[ThStatusCode.RoomRepositoryErrorGettingRoomList] = "Error getting the room list. Please try again.";
ThMessage[ThStatusCode.RoomRepositoryErrorGettingRoom] = "Error getting the room. Please try again.";
ThMessage[ThStatusCode.RoomRepositoryRoomNotFound] = "Room not found.";
ThMessage[ThStatusCode.RoomRepositoryErrorReadingCategoryIdList] = "Error reading category list for defined rooms.";
ThMessage[ThStatusCode.RoomRepositoryNameAlreadyExists] = "Room name already exists for this hotel.";
ThMessage[ThStatusCode.RoomRepositoryErrorUpdatingRoom] = "Error updating room.";
ThMessage[ThStatusCode.RoomRepositoryProblemUpdatingRoom] = "Problem updating the room. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.RoomRepositoryErrorAddingRoom] = "Error creating room.";
ThMessage[ThStatusCode.RoomRepositoryErrorReadingDocumentCount] = "Error getting document count.";
ThMessage[ThStatusCode.RoomItemUpdateStrategyErrorUpdating] = "Error updating room.";
ThMessage[ThStatusCode.SaveRoomItemError] = "Error saving room.";
ThMessage[ThStatusCode.DeleteRoomItemError] = "Error deleting room.";
ThMessage[ThStatusCode.RoomsControllerErrorGettingRooms] = "Error getting the rooms.";
ThMessage[ThStatusCode.RoomsControllerErrorSavingRoom] = "Error saving room.";
ThMessage[ThStatusCode.RoomsControllerErrorDeletingRoom] = "Error deleting room.";
ThMessage[ThStatusCode.RoomsControllerErrorGettingRoomById] = "Error getting room by id.";
ThMessage[ThStatusCode.RoomsControllerErrorGettingRoomCategories] = "Error getting room categories.";
ThMessage[ThStatusCode.RoomsControllerErrorGettingCount] = "Error getting the number of rooms.";
ThMessage[ThStatusCode.SaveRoomItemInvalidCategoryId] = "Invalid category id.";
ThMessage[ThStatusCode.SaveRoomItemInvalidAmenityList] = "Invalid amenity list.";
ThMessage[ThStatusCode.SaveRoomItemInvalidAttributeList] = "Invalid attribute list.";
ThMessage[ThStatusCode.SaveRoomItemInvalidBedList] = "Invalid bed list.";
ThMessage[ThStatusCode.RoomAggregatorGetUsedCategoriesError] = "Error getting the room categories that have at least a room associated.";
ThMessage[ThStatusCode.RoomAggregatorCategoryStatsListInvalidCatgoryIdListError] = "Invalid category id list";
ThMessage[ThStatusCode.RoomAggregatorGetRoomsByCategoryIdListError] = "Error getting rooms by category id list";
ThMessage[ThStatusCode.RoomAggregatorCategoryStatsListError] = "Error computing the room category stats list.";
ThMessage[ThStatusCode.RoomAggregatorCategoryStatsError] = "Error computing the room category stats.";
ThMessage[ThStatusCode.RoomAggregatorRoomStatsError] = "Error computing the room stats.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorGettingRoomCategoryList] = "Error getting the room category list. Please try again.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorGettingRoomCategory] = "Error getting the room category. Please try again.";
ThMessage[ThStatusCode.RoomCategoryRepositoryNameAlreadyExists] = "The room category you entered already exists.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorAddingRoomCategory] = "Error creating room category.";
ThMessage[ThStatusCode.RoomCategoryRepositoryRoomCategoryNotFound] = "Room category not found.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorGettingRoom] = "Error getting room.";
ThMessage[ThStatusCode.RoomCategoryRepositoryProblemUpdatingRoomCategory] = "Problem updating the room category. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.RoomCategoryRepositoryErrorUpdatingRoomCategory] = "Error updating room category.";
ThMessage[ThStatusCode.SaveRoomCategoryItemError] = "Error saving room category.";
ThMessage[ThStatusCode.DeleteRoomCategoryItemError] = "Error deleting room category.";
ThMessage[ThStatusCode.RoomCategoryItemUpdateStrategyErrorUpdating] = "Error updating room category id.";
ThMessage[ThStatusCode.RoomCategoriesControllerErrorSavingRoomCategory] = "Error saving room category.";
ThMessage[ThStatusCode.RoomCategoriesControllerErrorDeletingRoomCategory] = "Error deleting room category.";
ThMessage[ThStatusCode.RoomCategoriesControllerErrorGettingRoomCategoryById] = "Error getting room category by id.";
ThMessage[ThStatusCode.RoomCategoriesControllerErrorGettingRoomCategoriesStats] = "Error getting room categories stats.";
ThMessage[ThStatusCode.RoomCategoriesControllerErrorGettingUsedRoomCategoriesStats] = "Error getting used room categories stats.";
ThMessage[ThStatusCode.HotelUpdatePaymentsPoliciesErrorPrecheckingConstraints] = "There was a problem while checking the payments and policies submitted.";
ThMessage[ThStatusCode.HotelUpdatePaymentPoliciesInvalidTaxes] = "Invalid taxes sent.";
ThMessage[ThStatusCode.HotelUpdatePaymentsPoliciesError] = "Error adding the payments and policies.";
ThMessage[ThStatusCode.HotelUpdatePaymentPoliciesInvalidCurrencyCode] = "Invalid currency code.";
ThMessage[ThStatusCode.HotelSaveTaxItemError] = "Error saving the tax item.";
ThMessage[ThStatusCode.HotelSaveTaxItemValidationProblem] = "Error validating the tax.";
ThMessage[ThStatusCode.TaxItemUpdateStrategyErrorUpdating] = "Error updating the tax.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsUpdateError] = "Error updating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsValidationError] = "Error validating the property details. Please try again.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidAmenityIdList] = "Invalid amenity list.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidOperationHours] = "Invalid operation hours.";
ThMessage[ThStatusCode.HotelUpdatePropertyDetailsInvalidTimezone] = "Invalid timezone.";
ThMessage[ThStatusCode.HotelDetailsControllerErrorUpdatingPropertyDetails] = "Error updating property details.";
ThMessage[ThStatusCode.TaxRepositoryErrorGettingTaxList] = "Error getting the tax list. Please try again.";
ThMessage[ThStatusCode.TaxRepositoryErrorGettingTax] = "Error getting the tax. Please try again.";
ThMessage[ThStatusCode.TaxRepositoryNameAlreadyExists] = "The name of the tax already exists.";
ThMessage[ThStatusCode.TaxRepositoryErrorAddingTax] = "Error adding tax.";
ThMessage[ThStatusCode.TaxRepositoryProblemUpdatingTax] = "Problem updating the tax. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.TaxRepositoryErrorUpdatingTax] = "Error updating tax.";
ThMessage[ThStatusCode.TaxRepositoryTaxNotFound] = "Tax not found.";
ThMessage[ThStatusCode.HotelDeleteTaxItemError] = "Error deleting tax item.";
ThMessage[ThStatusCode.HotelDeleteTaxItemErrorDeleting] = "Error deleting tax item.";
ThMessage[ThStatusCode.HotelDeleteTaxItemErrorValidating] = "Error validating the existing tax item.";
ThMessage[ThStatusCode.HotelDeleteTaxItemUsedInAddOnProducts] = "Cannot delete the tax because it is used in add on products.";
ThMessage[ThStatusCode.HotelDeleteTaxItemUsedInDraftOrActivePriceProducts] = "Cannot delete the tax because it is used in active or draft price products.";
ThMessage[ThStatusCode.TaxControllerErrorGettingTaxes] = "Error getting the taxes.";
ThMessage[ThStatusCode.TaxControllerErrorSavingTax] = "Error saving tax.";
ThMessage[ThStatusCode.TaxControllerErrorDeletingTax] = "Error deleting tax.";
ThMessage[ThStatusCode.AddOnProductRepositoryProblemUpdatingAddOnProduct] = "Problem updating the add on product. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorUpdatingAddOnProduct] = "Error updating add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryNameAlreadyExists] = "The add on product name you entered already exists.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorAddingAddOnProduct] = "Error creating add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryProductNotFound] = "Add on product not found.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorGettingAddOnProduct] = "Error getting add on product.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorReadingCategoryIdList] = "Error reading category list for defined add on products.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorReadingDocumentCount] = "Error getting document count.";
ThMessage[ThStatusCode.AddOnProductRepositoryErrorGettingList] = "Error getting add on products.";
ThMessage[ThStatusCode.SaveAddOnProductItemError] = "Error saving add on product.";
ThMessage[ThStatusCode.SaveAddOnProductItemInvalidCategoryId] = "Invalid category id.";
ThMessage[ThStatusCode.TaxIdValidatorInvalidTaxId] = "Invalid tax id.";
ThMessage[ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdating] = "Error updating add on product id.";
ThMessage[ThStatusCode.DeleteAddOnProductItemError] = "Error deleting add on product.";
ThMessage[ThStatusCode.DeleteAddOnProductItemErrorValidating] = "Error validating add on product.";
ThMessage[ThStatusCode.DeleteAddOnProductItemUsedInDraftOrActivePriceProducts] = "Cannot delete the add on product because it was added in active or draft price products.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingAddOnProduct] = "Error getting add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorSavingAddOnProduct] = "Error saving add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorDeletingAddOnProduct] = "Error deleting add on product.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingCategoryIdList] = "Error getting the categories for your add on products.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingCount] = "Error getting the number of add on products.";
ThMessage[ThStatusCode.AddOnProductsControllerErrorGettingList] = "Error getting the list of add on products.";
ThMessage[ThStatusCode.AddOnProductIdValidatorInvalidId] = "Invalid add on product id list.";
ThMessage[ThStatusCode.CustomerRepositoryCustomerNotFound] = "The customer was not found.";
ThMessage[ThStatusCode.CustomerRepositoryErrorGettingCustomer] = "Error getting customer.";
ThMessage[ThStatusCode.CustomerRepositoryErrorCreatingCustomer] = "Error creating customer.";
ThMessage[ThStatusCode.CustomerRepositoryProblemUpdatingCustomer] = "Problem updating the customer. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.CustomerRepositoryErrorUpdatingCustomer] = "Error updating the customer.";
ThMessage[ThStatusCode.CustomerRepositoryErrorReadingCustomerCount] = "Error getting the number of customers.";
ThMessage[ThStatusCode.CustomerRepositoryErrorGettingList] = "Error getting customers.";
ThMessage[ThStatusCode.SaveCustomerItemError] = "Error saving customer.";
ThMessage[ThStatusCode.SaveCustomerItemInvalidOrNullClientType] = "Invalid client type.";
ThMessage[ThStatusCode.SaveCustomerItemCompOrTACannotBeLinkedToOtherCustomers] = "Companies or travel agencies cannot be linked to other customers.";
ThMessage[ThStatusCode.CustomerIdValidatorInvalidId] = "Invalid list of customers.";
ThMessage[ThStatusCode.CustomerItemUpdateStrategyError] = "Error updating customer.";
ThMessage[ThStatusCode.CustomerItemUpdateStrategyCustTypeChanged] = "The type of a customer cannot be changed.";
ThMessage[ThStatusCode.CustomerItemUpdateStrategyPriceProductUsedInAllotment] = "You cannot remove price products used in allotments. Please archive the allotments first.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingCustomer] = "Error getting customer.";
ThMessage[ThStatusCode.CustomersControllerErrorSavingCustomer] = "Error saving customer.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingCount] = "Error getting the number of customers.";
ThMessage[ThStatusCode.CustomersControllerErrorGettingList] = "Error getting the list of customers.";
ThMessage[ThStatusCode.PriceProductRepositoryErrorAddingPriceProduct] = "Error adding price product.";
ThMessage[ThStatusCode.PriceProductRepositoryProductNotFound] = "Price product not found.";
ThMessage[ThStatusCode.PriceProductRepositoryErrorGettingPriceProduct] = "Error getting price product.";
ThMessage[ThStatusCode.PriceProductRepositoryProblemUpdatingPriceProduct] = "Problem updating price product. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.PriceProductRepositoryErrorUpdatingPriceProduct] = "Error updating price product.";
ThMessage[ThStatusCode.PriceProductRepositoryErrorReadingDocumentCount] = "Error reading the number of price products.";
ThMessage[ThStatusCode.PriceProductRepositoryErrorGettingList] = "Error getting the list of price products.";
ThMessage[ThStatusCode.SavePriceProductItemError] = "Error saving price product.";
ThMessage[ThStatusCode.SavePriceProductItemInvalidPrice] = "Invalid price submitted.";
ThMessage[ThStatusCode.SavePriceProductItemInvalidConstraints] = "Invalid constraints submitted.";
ThMessage[ThStatusCode.SavePriceProductItemInvalidConditions] = "Invalid conditions submitted.";
ThMessage[ThStatusCode.PriceProductItemUpdateStrategyOnlyActiveAndDraftCanBeUpdated] = "Only draft or active price products can be updated.";
ThMessage[ThStatusCode.PriceProductItemStrategyInvalidStatus] = "A price product can only be saved as draft or active.";
ThMessage[ThStatusCode.PriceProductValidatorUnusedRoomCategoryId] = "You can assign on the price product only room categories which have rooms assigned.";
ThMessage[ThStatusCode.PriceProductValidatorEmptyRoomCategoryList] = "Please assign at least one room category to the price product.";
ThMessage[ThStatusCode.PriceProductValidatorInvalidPrices] = "Please complete all the required price values.";
ThMessage[ThStatusCode.ArchivePriceProductItemError] = "Please while archiving the price product.";
ThMessage[ThStatusCode.ArchivePriceProductItemNonActiveStatus] = "Please while archiving the price product.";
ThMessage[ThStatusCode.ArchivePriceProductItemUsedInCustomersError] = "Could not archive the price product because it is assigned to customers.";
ThMessage[ThStatusCode.UpdatePriceProductItemStatusError] = "Error updating the status of the price product.";
ThMessage[ThStatusCode.UpdatePriceProductItemStatusWrongStatus] = "Cannot run this action on the current price product.";
ThMessage[ThStatusCode.DraftPriceProductItemOnlyArchived] = "Only archived price products can be marked as drafts.";
ThMessage[ThStatusCode.DraftPriceProductItemError] = "Error marking the price product as draft.";
ThMessage[ThStatusCode.PriceProductsYieldManagementInvalidInterval] = "Invalid interval submitted.";
ThMessage[ThStatusCode.PriceProductIdValidatorInvalidId] = "Invalid price products.";
ThMessage[ThStatusCode.PriceProductsControllerErrorGettingPriceProduct] = "Error getting price product.";
ThMessage[ThStatusCode.PriceProductsControllerErrorSavingPriceProduct] = "Error saving price product.";
ThMessage[ThStatusCode.PriceProductsControllerErrorDeletingPriceProduct] = "Error deleting price product.";
ThMessage[ThStatusCode.PriceProductsControllerErrorMarkingPriceProductAsDraft] = "Error marking the price product as draft.";
ThMessage[ThStatusCode.PriceProductsControllerErrorArchivingProduct] = "Error archiving price product.";
ThMessage[ThStatusCode.PriceProductsControllerErrorGettingCount] = "Error the number of price products.";
ThMessage[ThStatusCode.PriceProductsControllerErrorGettingList] = "Error getting the list price product.";
ThMessage[ThStatusCode.YieldManagerControllerErrorClosing] = "Error closing the period for the price products.";
ThMessage[ThStatusCode.YieldManagerControllerErrorOpening] = "Error opening the period for the price products.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryNotFound] = "Hotel configuration not found.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryReadError] = "Cannot read hotel configuration.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryErrorAddingConfiguration] = "Cannot add hotel configuration.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryAlreadyExists] = "This configuration already exists for the hotel.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryProblemUpdatingConfiguration] = "Problem updating hotel configuration - concurrency.";
ThMessage[ThStatusCode.HotelConfigurationRepositoryErrorUpdatingConfiguration] = "Error updating hotel configuration.";
ThMessage[ThStatusCode.YieldFilterValidatorInvalidFilters] = "Invalid price product filters.";
ThMessage[ThStatusCode.HotelConfigurationControlllerErrorGettingYieldFilterConfig] = "The yield filter config for this hotel could not be read.";
ThMessage[ThStatusCode.HotelConfigurationControlllerErrorSavingYieldFilterValue] = "Error saving the yield filter value.";
ThMessage[ThStatusCode.SaveYieldFilterValueError] = "Error saving the yield filter value.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorGettingYieldFilter] = "Error finding yield filter by id.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorGettingYieldFilterValue] = "Error finding yield filter value by id.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorAddingYieldFilterValue] = "Error adding filter value.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorUpdatingYieldFilterValue] = "Error updating filter value.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorDuplicateFilterValue] = "Duplicate filter value.";
ThMessage[ThStatusCode.YieldFilterRepositoryErrorLabelOrColorCodeInvalid] = "Filter Rules -> TextFilter: label-defined, colorCode-null; ColorFilter: label-null, colorCode-defined";
ThMessage[ThStatusCode.AllotmentRepositoryErrorAddingAllotment] = "Error adding allotment.";
ThMessage[ThStatusCode.AllotmentRepositoryAllotmentNotFound] = "Allotment not found.";
ThMessage[ThStatusCode.AllotmentRepositoryErrorGettingAllotment] = "Error getting allotment.";
ThMessage[ThStatusCode.AllotmentRepositoryProblemUpdatingAllotment] = "Error updating allotment. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.AllotmentRepositoryErrorUpdatingAllotment] = "Error updating allotment.";
ThMessage[ThStatusCode.AllotmentRepositoryErrorReadingDocumentCount] = "Error reading the number of allotments.";
ThMessage[ThStatusCode.AllotmentRepositoryErrorGettingList] = "Error getting the allotments.";
ThMessage[ThStatusCode.SaveAllotmentItemError] = "Error saving allotment.";
ThMessage[ThStatusCode.SaveAllotmentItemInvalidConstraints] = "Error validating the constraints.";
ThMessage[ThStatusCode.SaveAllotmentItemInvalidInterval] = "Invalid interval submitted.";
ThMessage[ThStatusCode.SaveAllotmentItemInvalidIntervalLength] = "The interval for the allotment is too large. Please use intervals smaller than 5 years.";
ThMessage[ThStatusCode.SaveAllotmentItemInvalidAvailability] = "Please insert the number of available rooms for each day from the week.";
ThMessage[ThStatusCode.AllotmentValidatorInvalidPriceProductId] = "Please select a price product that is attached to the customer.";
ThMessage[ThStatusCode.AllotmentValidatorNotActivePriceProduct] = "Allotments can only be created on Active Price Products.";
ThMessage[ThStatusCode.AllotmentValidatorInvalidRoomCategId] = "Allotments can only be created on a specific room category from the price product.";
ThMessage[ThStatusCode.AllotmentIdValidatorInvalidId] = "Invalid allotments list.";
ThMessage[ThStatusCode.ArchiveAllotmentItemError] = "Error archiving allotment.";
ThMessage[ThStatusCode.ArchiveAllotmentItemNotActiveAllotment] = "Only active allotments can be archived.";
ThMessage[ThStatusCode.AllotmentsControllerErrorGettingAllotment] = "Error getting allotment.";
ThMessage[ThStatusCode.AllotmentsControllerErrorSavingAllotment] = "Error saving allotment.";
ThMessage[ThStatusCode.AllotmentsControllerErrorArchivingAllotment] = "Error archiving allotment.";
ThMessage[ThStatusCode.AllotmentsControllerErrorGettingCount] = "Error getting the number of allotments.";
ThMessage[ThStatusCode.AllotmentsControllerErrorGettingList] = "Error getting the list of allotments.";
ThMessage[ThStatusCode.HotelDetailsRepositoryErrorGettingList] = "Error getting the list of hotels.";
ThMessage[ThStatusCode.HotelIteratorError] = "Error iterating through the hotels.";
ThMessage[ThStatusCode.AllotmentArchiverCronJobExecutorError] = "Error archiving allotments from the process.";
ThMessage[ThStatusCode.NotificationsRepositoryErrorAddingNotification] = "Error adding a notification.";
ThMessage[ThStatusCode.NotificationsRepositoryErrorGettingUndelivered] = "Error getting undelivered notifications.";
ThMessage[ThStatusCode.NotificationsRepositoryErrorMarkingAsRead] = "Error marking notification as read.";
ThMessage[ThStatusCode.PdfReportServiceErrorCreatingOutputFolder] = "Error creating report output directory.";
ThMessage[ThStatusCode.PdfReportServiceErrorWritingHtmlToFile] = "Error writing html file on disk.";
ThMessage[ThStatusCode.PdfReportServiceHtmlToPdfError] = "Error in the following flow: generate html -> convert html to pdf.";
ThMessage[ThStatusCode.PhantomHtmlToPdfConverter] = "Error converting html to pdf with phantom js.";
ThMessage[ThStatusCode.GeneratInvoiceGroupActionFactoryError] = "Error getting the invoice group generation action (update or add new invoice group).";
ThMessage[ThStatusCode.GenerateBookingInvoiceError] = "Error adding booking related invoice group.";
ThMessage[ThStatusCode.GenerateBookingInvoiceErrorBuildingDefaultInvoice] = "Error building the default booking invoice object.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorAddingInvoiceGroup] = "Error adding the invoice group.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryProblemUpdatingInvoiceGroup] = "Problem updating the invoice group - concurrency.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorUpdatingInvoiceGroup] = "Error updating the invoice group.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorGettingInvoiceGroupList] = "Error getting the list of invoice groups.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorGettingInvoice] = "Error getting invoice.";
ThMessage[ThStatusCode.InvoiceGroupsItemUpdateStrategyErrorUpdating] = "Error updating the invoice group item.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryInvoiceGroupNotFound] = "Invoice group not found.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorGettingInvoiceGroup] = "Error retrieving the invoice group from the database.";
ThMessage[ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroupById] = "Error getting invoice group by id.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryErrorReadingDocumentCount] = "Error reading invoice grupt document count.";
ThMessage[ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroups] = "Error getting the invoice group list.";
ThMessage[ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroupsCount] = "Error getting the total number of invoice groups matching the search criteria.";
ThMessage[ThStatusCode.InvoiceGroupsControllerErrorGettingInvoiceGroupsBrief] = "Error getting brief info about the required invoices.";
ThMessage[ThStatusCode.InvoiceGroupsBriefDataAggregatorErrorGettingInvoiceGroupsBrief] = "Error getting brief info about the required invoices.";
ThMessage[ThStatusCode.SaveInvoiceGroupItem] = "Error saving the invoice group item.";
ThMessage[ThStatusCode.SaveInvoiceGroupError] = "Error updating the invoice group.";
ThMessage[ThStatusCode.InvoicePaymentMethodValidatorError] = "Error validating the payment methods.";
ThMessage[ThStatusCode.InvoicePaymentMethodValidatorInvalidPaymentMethod] = "Unrecognized payment method.";
ThMessage[ThStatusCode.InvoicePaymentMethodValidatorUnsupportedPaymentMethod] = "The payment method selected is not supported by the hotel.";
ThMessage[ThStatusCode.InvoicePaymentMethodValidatorCannotPayByAgreement] = "You cannot pay the invoice by agreement as the selected customer does not support this method.";
ThMessage[ThStatusCode.InvoicePaymentValidatorError] = "Error validating the invoice payment.";
ThMessage[ThStatusCode.GetInvoiceGroupBriefDataError] = "Error getting the invoice group brief data.";
ThMessage[ThStatusCode.InvoicePayersValidatorError] = "Error validating the payers that split the invoice payment.";
ThMessage[ThStatusCode.InvoicePayersValidatorInvalidSplit] = "Error validating the payers that split the invoice payment.";
ThMessage[ThStatusCode.CustomerInvoiceGroupUpdateStrategyErrorUpdating] = "Error updating the invoice group.";
ThMessage[ThStatusCode.CustomerInvoiceGroupAddStrategyErrorAdding] = "Error adding the invoice group.";
ThMessage[ThStatusCode.BookingInvoiceGroupUpdateStrategyErrorUpdating] = "Error updating the invoice group.";
ThMessage[ThStatusCode.InvoiceGroupsRepositoryBookingPriceLinkError] = "Error linking booking prices with the invoice groups.";
ThMessage[ThStatusCode.InvoiceEmailSenderErrorSendingEmail] = "Error sending invoice by email.";
ThMessage[ThStatusCode.SlackSendMessageError] = "Error sending the message using Slack.";
ThMessage[ThStatusCode.AddBookingsRepositoryEmptyBookingList] = "Empty booking list.";
ThMessage[ThStatusCode.AddBookingsRepositoryNoBookingsLimitExceeded] = "You can't create more than 50 bookings at once.";
ThMessage[ThStatusCode.AddBookingsRepositoryErrorAddingBookingGroup] = "Error adding bookings.";
ThMessage[ThStatusCode.AddBookingItemsError] = "Error adding bookings.";
ThMessage[ThStatusCode.BookingIntervalValidatorError] = "Error validating booking interval.";
ThMessage[ThStatusCode.BookingIntervalValidatorInvalidInterval] = "Invalid interval.";
ThMessage[ThStatusCode.BookingIntervalValidatorInvalidStartDate] = "Invalid start date for bookings.";
ThMessage[ThStatusCode.BookingIntervalValidatorMaxSixMonths] = "The maximum interval for a booking is 6 months.";
ThMessage[ThStatusCode.AddBookingItemsInvalidNoOfBookings] = "The maximum number of bookings you can add is 50.";
ThMessage[ThStatusCode.BookingItemsConverterError] = "There was a problem while reading the bookings.";
ThMessage[ThStatusCode.BookingValidationError] = "There was a problem while validating the bookings.";
ThMessage[ThStatusCode.BookingsValidatorBillingCustomerMissing] = "The billable customer must be in the customer list.";
ThMessage[ThStatusCode.BookingsValidatorYieldingClosed] = "You cannot book a price product that is not opened in the Yield Manager for the selected interval.";
ThMessage[ThStatusCode.BookingsValidatorAllotmentCustomer] = "The main customer from the booking must be the one from the allotment.";
ThMessage[ThStatusCode.BookingsValidatorAllotmentInvalidRoomCategory] = "You can only book the room category selected within the allotment.";
ThMessage[ThStatusCode.BookingsValidatorMissingPaymentGuarantee] = "You need to set a payment guarantee for all the price products with cancellation conditions.";
ThMessage[ThStatusCode.BookingsValidatorNoCompaniesOrTALimit] = "You cannot have more than 1 Company or Travel Agent on a booking";
ThMessage[ThStatusCode.BookingsValidatorBilledCustomerInvalidRightsOnPriceProduct] = "All the billed customers must have access on the price products.";
ThMessage[ThStatusCode.BookingsValidatorConstraintsDoNotApply] = "The constraints from the price product do not apply for the booking.";
ThMessage[ThStatusCode.BookingsValidatorAllotmentConstraintsDoNotApply] = "The constraints from the allotment do not apply for the booking.";
ThMessage[ThStatusCode.BookingsValidatorInvalidRoomCategoryId] = "The room category is not valid within the price product from the booking.";
ThMessage[ThStatusCode.BookingsValidatorInvalidBookingCapacity] = "Each booking must have at least one adult or one child.";
ThMessage[ThStatusCode.BookingsValidatorInvalidPriceForRoomCategoryId] = "The selected room category does not have a price configuration in the Price Product for the number of people from the booking.";
ThMessage[ThStatusCode.BookingsValidatorInvalidRoomId] = "The room was not found.";
ThMessage[ThStatusCode.BookingsValidatorRoomCategoryNotFoundInActiveInventory] = "The room category was not found in the active room inventory.";
ThMessage[ThStatusCode.BookingsValidatorInsufficientRoomCategoryCapacity] = "Insufficient capacity to fit into the selected room category.";
ThMessage[ThStatusCode.BookingsRepositoryProblemUpdatingBooking] = "Error updating booking. It is possible that someone else changed it at the same time. Please refresh the page and try again.";
ThMessage[ThStatusCode.BookingsRepositoryErrorUpdatingBooking] = "Error updating booking.";
ThMessage[ThStatusCode.BookingsRepositoryErrorGettingList] = "Error getting the list of bookings.";
ThMessage[ThStatusCode.BookingRepositoryErrorReadingDocumentCount] = "Error getting the number of bookings.";
ThMessage[ThStatusCode.BookingRepositoryBookingNotFound] = "Booking not found.";
ThMessage[ThStatusCode.BookingRepositoryErrorGettingBooking] = "Error getting booking.";
ThMessage[ThStatusCode.BookingConfirmationErrorGettingData] = "Error getting data for the booking confirmation.";
ThMessage[ThStatusCode.BookingConfirmationEmailSenderErrorSendingEmail] = "Error sending booking confirmation by email.";
ThMessage[ThStatusCode.BookingSearchError] = "Error searching for price products.";
ThMessage[ThStatusCode.RoomInventoryAggregatorError] = "Error aggregating the rooms from the inventory.";
ThMessage[ThStatusCode.BookingOccupancyCalculatorError] = "Error computing booking occupancy.";
ThMessage[ThStatusCode.BookingOccupancyCalculatorErrorIndexing] = "Error computing booking occupancy.";
ThMessage[ThStatusCode.BookingDependenciesFilterError] = "Error filtering the price products.";
ThMessage[ThStatusCode.BookingsValidatorAllotmentInsufficientInventory] = "Insufficient inventory for the selected allotments. It is possible that they were booked since the search.";
ThMessage[ThStatusCode.SearchResultBuilderError] = "Error building the search results.";
ThMessage[ThStatusCode.BookingsValidatorAllotmentOpenIntervalMismatch] = "The allotment is not open for the given period.";
ThMessage[ThStatusCode.BookingsControllerErrorGettingBookingById] = "Error getting booking by id.";
ThMessage[ThStatusCode.BookingsControllerErrorGettingBookings] = "Error getting bookings.";
ThMessage[ThStatusCode.BookingsControllerErrorGettingCount] = "Error getting the number of bookings.";
ThMessage[ThStatusCode.BookingsControllerErrorSearchingBookings] = "Error searching for bookings.";
ThMessage[ThStatusCode.BookingsControllerErrorAddingBookings] = "Error adding bookings.";
ThMessage[ThStatusCode.BookingStatusChangerCronJobExecutorError] = "Error changing booking statuses from the process.";
ThMessage[ThStatusCode.HotelTimeNullTimezone] = "The timezone for the hotel is not set.";
ThMessage[ThStatusCode.HotelTimeError] = "Error getting the current time for your hotel.";
ThMessage[ThStatusCode.HotelOperationsRoomInfoReaderError] = "Error getting the hotel operations data.";
ThMessage[ThStatusCode.HotelOperationsArrivalsReaderError] = "Error getting the information for the arrivals.";
ThMessage[ThStatusCode.HotelOperationsDeparturesReaderError] = "Error getting the information for the departures.";
ThMessage[ThStatusCode.AssignRoomError] = "Error assigning the room.";
ThMessage[ThStatusCode.AssignRoomOccupied] = "Error assigning the room. It's possible that the room is already occupied or reserved for another customer during this period.";
ThMessage[ThStatusCode.AssignRoomCheckedInWrongInterval] = "There is already a checked in booking on this room that has the wrong interval. Please check out the room first.";
ThMessage[ThStatusCode.AssignRoomPaidInvoice] = "You cannot change the price for this booking because the invoice has been already paid.";
ThMessage[ThStatusCode.ChangeRoomStrategyOnlyWhenCheckedIn] = "The room can be changed only to checked in bookings.";
ThMessage[ThStatusCode.ChangeRoomStrategyEndDateInPast] = "You cannot change the room for a booking that has the end date in the past. Please check out the room.";
ThMessage[ThStatusCode.CheckInStrategyOnlyConfirmedOrGuaranteed] = "Only Confirmed or Guaranteed bookings can be checked in.";
ThMessage[ThStatusCode.CheckInStrategyNoPaymentGuarantee] = "You cannot check in a booking without first adding a Patment Guarantee on it.";
ThMessage[ThStatusCode.CheckInStrategyStartDateInFuture] = "You cannot check in a booking that starts in the future.";
ThMessage[ThStatusCode.CheckInStrategyEndDateInPast] = "You cannot check in a booking that has the end date in the past. Please cancel the booking.";
ThMessage[ThStatusCode.ReserveRoomStrategyOnlyConfirmedOrGuaranteed] = "Only Confirmed or Guaranteed bookings can be reserved for specific rooms.";
ThMessage[ThStatusCode.ReserveRoomStrategyEndDateInPast] = "You cannot reserve a room for a booking that has the end date in the past. Please cancel the booking.";
ThMessage[ThStatusCode.CheckOutRoomError] = "Error checking out the room.";
ThMessage[ThStatusCode.CheckOutRoomBookingNotCheckedIn] = "Error checking out the room. The booking does not appear as checked in.";
ThMessage[ThStatusCode.HotelOperationsDashboardControllerErrorGettingArrivals] = "Error getting the arrivals.";
ThMessage[ThStatusCode.HotelOperationsDashboardControllerErrorGettingDepartures] = "Error getting the departures.";
ThMessage[ThStatusCode.HotelOperationsDashboardControllerErrorGettingRooms] = "Error getting rooms.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorCheckingIn] = "Error checking in the room.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorCheckingOut] = "Error checking out the room.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorReservingRoom] = "Error reserving room.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorChangingRoom] = "Error changing room.";
ThMessage[ThStatusCode.BookingOccupancyCalculatorWrapperError] = "Error getting occupancy.";
ThMessage[ThStatusCode.BookingOccupancyCalculatorWrapperInvalidInterval] = "Invalid submitted interval.";
ThMessage[ThStatusCode.BookingPossiblePricesError] = "Error getting all the possible prices for the booking.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorGettingPossiblePrices] = "Error getting all the possible prices for the booking.";
ThMessage[ThStatusCode.MarkOccupiedRoomsAsDirtyCronJobExecutorError] = "Error marking rooms as dirty.";
ThMessage[ThStatusCode.ChangeRoomMaintenanceStatusError] = "Error changing the maintenance status of the room.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorChangingMaintenanceStatus] = "Error changing the maintenance status of the room.";
ThMessage[ThStatusCode.RoomAttachedBookingError] = "Error getting attached booking for the room.";
ThMessage[ThStatusCode.HotelRoomOperationsControllerErrorGettingAttachedBooking] = "Error getting attached booking for the room.";
ThMessage[ThStatusCode.BookingWithDependenciesLoaderError] = "Error loading booking dependencies.";
ThMessage[ThStatusCode.BookingChangeDatesError] = "Error changing booking dates.";
ThMessage[ThStatusCode.BookingChangeDatesInvalidState] = "The date can be changed only for Confirmed, Guaranteed or Checked In bookings.";
ThMessage[ThStatusCode.BookingChangeDatesPaidInvoice] = "The dates cannot be changed because the invoice for this booking was paid.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorChangingDates] = "Error changing booking dates.";
ThMessage[ThStatusCode.BookingChangeNoShowTimeError] = "Error changing the no show time.";
ThMessage[ThStatusCode.BookingChangeNoShowTimeInvalidTime] = "Invalid submitted time.";
ThMessage[ThStatusCode.BookingChangeNoShowTimeInvalidState] = "The no show time can be changed only for confirmed or guaranteed bookings.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorChangingNoShowTime] = "Error changing the no show time.";
ThMessage[ThStatusCode.BookingChangeCapacityInvalidState] = "The capacity can be changed only for confirmed, guaranteed or no show bookings.";
ThMessage[ThStatusCode.BookingChangeCapacityPaidInvoice] = "The capacity cannot be changed because the invoice for this booking was paid.";
ThMessage[ThStatusCode.BookingChangeCapacityError] = "Error changing booking capacity.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorChangingCapacity] = "Error changing booking capacity.";
ThMessage[ThStatusCode.BookingPaymentGuaranteeError] = "Error adding payment guarantee.";
ThMessage[ThStatusCode.BookingPaymentGuaranteeInvalidState] = "A payment guarantee can be added only for confirmed or guaranteed bookings.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorAddingPaymentGuarantee] = "Error adding payment guarantee.";
ThMessage[ThStatusCode.BookingChangeDetailsInvalidState] = "You cannot change details for checked out or cancelled bookings.";
ThMessage[ThStatusCode.BookingChangeDetailsError] = "Error changing booking details.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorChangingDetails] = "Error changing booking details.";
ThMessage[ThStatusCode.BookingChangeCustomersInvalidState] = "The customers can be changed only for checked in, confirmed or guaranteed bookings.";
ThMessage[ThStatusCode.BookingChangeCustomersError] = "Error changing customers from booking.";
ThMessage[ThStatusCode.BookingChangeCustomersBilledCustomerMisssing] = "The billed customer is missing from the list.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorChangingCustomers] = "Error changing customers from booking.";
ThMessage[ThStatusCode.BookingCancelInvalidState] = "Only confirmed, guaranteed or no show bookings can be cancelled.";
ThMessage[ThStatusCode.BookingCancelError] = "Error cancelling booking.";
ThMessage[ThStatusCode.BookingReactivateInvalidState] = "Only no show bookings can be reactivated.";
ThMessage[ThStatusCode.BookingReactivateEndDateInThePast] = "You cannot reactivate a booking that ends in the past. Please cancel it.";
ThMessage[ThStatusCode.BookingReactivatePaidInvoice] = "You cannot reactivate a booking that has the invoice paid.";
ThMessage[ThStatusCode.BookingReactivateError] = "Error reactivating booking.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorCancelling] = "Error cancelling booking.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorReactivating] = "Error reactivating booking.";
ThMessage[ThStatusCode.EmailConfirmationError] = "Error sending email.";
ThMessage[ThStatusCode.HotelCommonOperationsControllerEmailError] = "Error sending email.";
ThMessage[ThStatusCode.BookingRemoveRollawayCapacityWarningError] = "Error updating the rollaway capacity flag on the booking.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorRemovingRollawayCapacity] = "Error updating the rollaway capacity flag on the booking.";
ThMessage[ThStatusCode.PriceProductReaderInvalidInterval] = "Invalid interval.";
ThMessage[ThStatusCode.PriceProductReaderError] = "Error getting price products.";
ThMessage[ThStatusCode.YieldManagerControllerErrorGettingYieldItems] = "Error getting price products.";
ThMessage[ThStatusCode.BookingReserveAddOnProductsInvalidState] = "Add on products can be reserved only for confirmed or guaranteed bookings.";
ThMessage[ThStatusCode.BookingReserveAddOnProductsError] = "Error reserving add on products for the booking.";
ThMessage[ThStatusCode.HotelBookingOperationsControllerErrorReservingAddOnProducts] = "Error reserving add on products for the booking.";
ThMessage[ThStatusCode.MongoHotelInventorySnapshotRepositoryDuplicate] = "Snapshot already exists.";
ThMessage[ThStatusCode.MongoHotelInventorySnapshotRepositoryError] = "Error adding snapshot.";
ThMessage[ThStatusCode.MongoHotelInventorySnapshotRepositoryErrorGettingSnapshots] = "Error getting snapshots.";
ThMessage[ThStatusCode.HotelInventorySnapshotCronJobExecutorError] = "Error creating snapshot from the process.";

export class ThResponse {
    statusCode: ThStatusCode;
    message: string;
    data: any;

    constructor(statusCode: ThStatusCode, data?: any) {
        this.statusCode = statusCode;
        this.message = ThMessage[statusCode];
        this.data = data;
        if (!this.data) {
            this.data = {};
        }
    }

    public buildJson(locale: Locales): Object {
        var thUtils = new ThUtils();
        if (!thUtils.isUndefinedOrNull(locale)) {
            this.translateMessage(locale);
        }
        return this;
    }
    private translateMessage(locale: Locales) {
        var translation = new ThTranslation(locale);
        this.message = translation.translate(this.message);
    }
}