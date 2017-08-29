import { HotelDO } from '../../../core/data-layer/hotel/data-objects/HotelDO';
import { HotelSequencesDO } from '../../../core/data-layer/hotel/data-objects/sequences/HotelSequencesDO';
import { HotelContactDetailsDO } from '../../../core/data-layer/hotel/data-objects/hotel-contact-details/HotelContactDetailsDO';
import { ActionTokenDO } from '../../../core/data-layer/hotel/data-objects/user/ActionTokenDO';
import { UserDO, AccountStatus, UserRoles } from '../../../core/data-layer/hotel/data-objects/user/UserDO';
import { UserContactDetailsDO } from '../../../core/data-layer/hotel/data-objects/user/UserContactDetailsDO';
import { AddressDO } from '../../../core/data-layer/common/data-objects/address/AddressDO';
import { CountryDO } from '../../../core/data-layer/common/data-objects/country/CountryDO';
import { PaymentMethodDO } from '../../../core/data-layer/common/data-objects/payment-method/PaymentMethodDO';
import { OperationHoursDO } from '../../../core/data-layer/hotel/data-objects/operation-hours/OperationHoursDO';
import { ThHourDO } from '../../../core/utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../core/utils/th-dates/data-objects/ThTimestampDO';
import { ThUtils } from '../../../core/utils/ThUtils';
import { Locales } from '../../../core/utils/localization/ThTranslation';
import { AppContext } from '../../../core/utils/AppContext';
import { PaymentMethodInstanceDO } from "../../../core/data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { TransactionFeeDO, TransactionFeeType } from "../../../core/data-layer/common/data-objects/payment-method/TransactionFeeDO";

import _ = require("underscore");

export class DefaultHotelBuilder {
    public static Timezone = "Europe/Bucharest";
    private _thUtils;

    constructor(private _appContext: AppContext, private _email: string, private _paymentMethodList: PaymentMethodDO[]) {
        this._thUtils = new ThUtils();
    }

    getHotel(): HotelDO {
        var hotel = new HotelDO();
        hotel.ccyCode = "EUR";
        hotel.contactDetails = new HotelContactDetailsDO();
        hotel.contactDetails.name = "3angleTECH Hotel";
        hotel.contactDetails.companyName = "THREEANGLE SOFTWARE SOLUTIONS";
        hotel.contactDetails.vatCode = "RO34121562";
        hotel.contactDetails.address = new AddressDO();
        hotel.contactDetails.address.city = "Bucharest";
        hotel.contactDetails.address.country = new CountryDO();
        hotel.contactDetails.address.country.code = "RO";
        hotel.contactDetails.address.country.name = "Romania";
        hotel.contactDetails.address.country.inEU = true;
        hotel.contactDetails.address.postalCode = "060204";
        hotel.contactDetails.address.streetAddress = "blvd Regiei nr 6D, bloc 4, etaj 4, birou 1A, sector 6";
        hotel.contactDetails.contactName = "Ionut Paraschiv";
        hotel.contactDetails.email = "contact@3angle.tech";
        hotel.contactDetails.fax = "0722375399";
        hotel.contactDetails.phone = "0722375399";
        hotel.contactDetails.websiteUrl = "www.3angle.tech";
        hotel.timezone = DefaultHotelBuilder.Timezone;
        hotel.operationHours = new OperationHoursDO();
        hotel.operationHours.checkOutFromOptional = ThHourDO.buildThHourDO(8, 0);
        hotel.operationHours.checkOutTo = ThHourDO.buildThHourDO(12, 0);
        hotel.operationHours.checkInFrom = ThHourDO.buildThHourDO(14, 0);
        hotel.operationHours.checkInToOptional = ThHourDO.buildThHourDO(19, 0);
        hotel.operationHours.cancellationHour = ThHourDO.buildThHourDO(19, 0);

        hotel.userList = [];
        var user = new UserDO();
        user.id = this._thUtils.generateUniqueID();
        user.accountStatus = AccountStatus.Active;
        user.accountActivationToken = new ActionTokenDO();
        user.accountActivationToken.code = this._thUtils.generateUniqueID();
        user.accountActivationToken.expiryTimestamp = new Date().getTime();
        user.accountActivationToken.updatedTimestamp = new Date().getTime();
        user.contactDetails = new UserContactDetailsDO();
        user.contactDetails.firstName = "Ionut Cristian";
        user.contactDetails.lastName = "Paraschiv";
        user.email = this._email;
        user.language = Locales.English;
        user.password = "";
        user.roleList = [UserRoles.Administrator];
        hotel.userList.push(user);
        hotel.amenityIdList = [];
        hotel.customAmenityList = [];
        hotel.paymentMethodList = this.getPaymentMethodList();
        hotel.configurationCompleted = false;
        hotel.configurationCompletedTimestamp = ThTimestampDO.buildThTimestampForTimezone(hotel.timezone);
        hotel.sequences = new HotelSequencesDO();
        hotel.sequences.setInitialValues();
        hotel.paymentDueInDays = 10;

        return hotel;
    }

    private getPaymentMethodList(): PaymentMethodInstanceDO[] {
        let paymentMethodList: PaymentMethodInstanceDO[] = [];
        let paymentIdList = this.getPaymentIdList();
        _.forEach(paymentIdList, (paymentMethodId: string) => {
            let paymentMethod = new PaymentMethodInstanceDO();
            paymentMethod.paymentMethodId = paymentMethodId;
            paymentMethod.transactionFee = new TransactionFeeDO();
            paymentMethod.transactionFee.amount = 0;
            paymentMethod.transactionFee.type = TransactionFeeType.Percentage;

            paymentMethodList.push(paymentMethod);
        });

        return paymentMethodList;
    }

    private getPaymentIdList(): string[] {
        return _.map(this._paymentMethodList, (paymentMethod: PaymentMethodDO) => {
            return paymentMethod.id;
        });
    }
}
