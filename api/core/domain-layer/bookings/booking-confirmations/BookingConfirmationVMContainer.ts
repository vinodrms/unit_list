import { ThTranslation } from '../../../utils/localization/ThTranslation';
import { ThUtils } from '../../../../core/utils/ThUtils';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { BookingConfirmationVM } from './BookingConfirmationVM';
import { BookingAggregatedDataContainer } from '../aggregators/BookingAggregatedDataContainer';
import { BookingAggregatedData } from '../aggregators/BookingAggregatedData';

import _ = require('underscore');

export class BookingConfirmationVMContainer {
    public static HOTEL_LOGO_PLACEHOLDER_SRC = 'assets/client/static-assets/images/hotel-logo-placeholder.png';
    public static UNITPAL_LOGO_SRC = 'assets/client/static-assets/images/unit_pal_logo_blue.png';

    private _thUtils: ThUtils;

    hotel: HotelDO;
    bookingConfirmationVMList: BookingConfirmationVM[];

    headerUnitPal: string;
    headerBookingRefLabel: string;
    headerGroupBookingRefLabel: string;
    headerTitle: string;

    hotelNameValue: string;

    hotelAddressValue: string;
    hotelAddressLabel: string;

    hotelContactValue: string;
    hotelContactLabel: string;
    hotelWebsite: string;

    hotelLogoSrcValue: string;
    unitpalLogoSrcValue: string;

    bodyCheckInLabel: string;
    bodyCheckOutLabel: string;
    bodyPriceLabel: string;
    bodyRoomLabel: string;
    bodyRoomNoItemsLabel: string;
    bodyNightsNoLabel: string;
    bodyBookingCapacityLabel: string;
    bodyBedSizesLabel: string;
    bodyAddOnProductsLabel: string;
    bodyReservedAddOnProductsLabel: string;
    bodyBreakfastAopLabel: string;
    bodyOthersAopLabel: string;
    bodyGuestsLabel: string;
    bodyCancellationPolicyLabel: string;
    bodyConstraintsLabel: string;
    bodyConfirmationNotesLabel: string;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromBookingAggregatedDataContainer(bookingAggregatedDataContainer: BookingAggregatedDataContainer) {
        this.hotel = bookingAggregatedDataContainer.hotel;
        this.initBookingConfirmationVMList(bookingAggregatedDataContainer);

        this.hotelNameValue = this.hotel.contactDetails.name;
        this.initHeaderLabels();
        this.initBodyLabels();
        this.initLogoSrcs();
        this.initHotelAddressLabelAndValue();
        this.initHotelContactLabelAndValue();
    }

    private initBookingConfirmationVMList(bookingAggregatedDataContainer: BookingAggregatedDataContainer) {
        this.bookingConfirmationVMList = [];
        _.forEach(bookingAggregatedDataContainer.bookingAggregatedDataList, (bookingAggregatedData: BookingAggregatedData) => {
            var bookingConfirmationVM = new BookingConfirmationVM(this._thTranslation);
            bookingConfirmationVM.buildFromBookingAggregatedData(bookingAggregatedData, this.hotel);
            bookingConfirmationVM.ccyCode = this.hotel.ccyCode;
            this.bookingConfirmationVMList.push(bookingConfirmationVM);
        });
    }

    private initHeaderLabels() {
        this.headerUnitPal = 'UnitPal';
        this.headerBookingRefLabel = this._thTranslation.translate('Booking Ref');
        this.headerGroupBookingRefLabel = this._thTranslation.translate('Group Booking Ref');
        this.headerTitle = this._thTranslation.translate('Booking Confirmation');
    }

    private initBodyLabels() {
        this.bodyCheckInLabel = this._thTranslation.translate('Check-In');
        this.bodyCheckOutLabel = this._thTranslation.translate('Check-Out');
        this.bodyPriceLabel = this._thTranslation.translate('Price');
        this.bodyRoomLabel = this._thTranslation.translate('Room');
        this.bodyRoomNoItemsLabel = this._thTranslation.translate('room');
        this.bodyNightsNoLabel = this._thTranslation.translate('night(s)');
        this.bodyBookingCapacityLabel = this._thTranslation.translate('Booked for');
        this.bodyBedSizesLabel = this._thTranslation.translate('Bed size(s)');
        this.bodyAddOnProductsLabel = this._thTranslation.translate('Included in Price');
        this.bodyReservedAddOnProductsLabel = this._thTranslation.translate('Reserved Add-On-Products');
        this.bodyBreakfastAopLabel = this._thTranslation.translate('Breakast');
        this.bodyOthersAopLabel = this._thTranslation.translate('Others');
        this.bodyGuestsLabel = this._thTranslation.translate('Guests');
        this.bodyCancellationPolicyLabel = this._thTranslation.translate('Cancellation Policy');
        this.bodyConstraintsLabel = this._thTranslation.translate('Constraints');
        this.bodyConfirmationNotesLabel = this._thTranslation.translate('Notes');
    }

    private initLogoSrcs() {
        if (!this._thUtils.isUndefinedOrNull(this.hotel.logoUrl)) {
            this.hotelLogoSrcValue = this.hotel.logoUrl;
        }
        else {
            this.hotelLogoSrcValue = BookingConfirmationVMContainer.HOTEL_LOGO_PLACEHOLDER_SRC;
        }

        this.unitpalLogoSrcValue = 'assets/client/static-assets/images/unit_pal_logo_blue.png';
    }

    private initHotelAddressLabelAndValue() {
        this.hotelAddressLabel = this._thTranslation.translate('Address');

        this.hotelAddressValue = this.hotel.contactDetails.address.streetAddress;
        if (!this._thUtils.isUndefinedOrNull(this.hotel.contactDetails.address.city)) {
            this.hotelAddressValue += ', ' + this.hotel.contactDetails.address.city;
        }
        if (!this._thUtils.isUndefinedOrNull(this.hotel.contactDetails.address.postalCode)) {
            this.hotelAddressValue += ', ' + this.hotel.contactDetails.address.postalCode;
        }
        if (!this._thUtils.isUndefinedOrNull(this.hotel.contactDetails.address.country)) {
            this.hotelAddressValue += ', ' + this.hotel.contactDetails.address.country.name;
        }
    }

    private initHotelContactLabelAndValue() {
        this.hotelContactLabel = this._thTranslation.translate('Contact');
        this.hotelContactValue = this.hotel.contactDetails.phone + " / " + this.hotel.contactDetails.email;
        this.hotelWebsite = "";
        if (_.isString(this.hotel.contactDetails.websiteUrl) && this.hotel.contactDetails.websiteUrl.length > 0) {
            this.hotelWebsite = this.hotel.contactDetails.websiteUrl;
        }
    }
}