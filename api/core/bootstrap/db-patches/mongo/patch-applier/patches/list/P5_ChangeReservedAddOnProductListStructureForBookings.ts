import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { AddOnProductBookingReservedItem } from "../../../../../../data-layer/bookings/data-objects/BookingDO";

import _ = require('underscore');

export class P5_ChangeReservedAddOnProductListStructureForBookings extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this.bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.ChangeReservedAddOnProductListStructureForBookings;
    }

    protected updateDocumentInMemory(booking) {
        if (!_.isArray(booking.reservedAddOnProductList)) {
            var addOnProductBookingReservedItemList: AddOnProductBookingReservedItem[] = [];
            if (booking.reservedAddOnProductIdList) {
                _.forEach(booking.reservedAddOnProductIdList , (aopId: string) => {
                    var exists = false;
                    _.forEach(addOnProductBookingReservedItemList, (item: AddOnProductBookingReservedItem) => {
                        if (item.aopId == aopId) {
                            item.noOfItems++;
                            exists = true;
                        }
                    });
                    if (!exists) {
                        var item = new AddOnProductBookingReservedItem();
                        item.aopId = aopId;
                        item.noOfItems = 1;
                        addOnProductBookingReservedItemList.push(item);
                    }
                });
                booking.reservedAddOnProductList = addOnProductBookingReservedItemList;
                delete booking.reservedAddOnProductIdList;
            }
        }
    }
}
