import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { BookingValidationStructures } from '../validators/BookingValidationStructures';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { CommonValidationStructures } from "../../common/CommonValidations";

import _ = require('underscore');

export class TransientBookingItemDO {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "interval",
                validationStruct: CommonValidationStructures.getThDateIntervalDOValidationStructure()
            },
            {
                key: "configCapacity",
                validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
            },
            {
                key: "roomCategoryId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "priceProductId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "allotmentId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
        ]);
    }

    public static convertToBookingList(transientBookingItemList: TransientBookingItemDO[]): BookingDO[] {
        var bookingList: BookingDO[] = [];
        _.forEach(transientBookingItemList, (transientBookingItem: TransientBookingItemDO) => {
            bookingList.push(TransientBookingItemDO.convertToBooking(transientBookingItem));
        });
        return bookingList;
    }
    private static convertToBooking(transientBookingItem: TransientBookingItemDO): BookingDO {
        var bookingDO: BookingDO = new BookingDO();

        bookingDO.interval = new ThDateIntervalDO();
        bookingDO.interval.buildFromObject(transientBookingItem.interval);

        bookingDO.configCapacity = new ConfigCapacityDO();
        bookingDO.configCapacity.buildFromObject(transientBookingItem.configCapacity);

        bookingDO.roomCategoryId = transientBookingItem.roomCategoryId;
        bookingDO.priceProductId = transientBookingItem.priceProductId;
        bookingDO.allotmentId = transientBookingItem.allotmentId;

        return bookingDO;
    }
}