import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { BookingDO, BookingConfirmationStatus } from "../../../../../../data-layer/bookings/data-objects/BookingDO";
import { IndexedBookingInterval } from "../../../../../../data-layer/price-products/utils/IndexedBookingInterval";
import { ThDateIntervalDO } from "../../../../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { PriceProductConditionsDO } from "../../../../../../data-layer/price-products/data-objects/conditions/PriceProductConditionsDO";

export class P12_UpdateBookingsGuaranteedTime extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this.bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.UpdateBookingsGuaranteedTime;
    }

    protected updateDocumentInMemory(booking: BookingDO) {
        if (booking.confirmationStatus === BookingConfirmationStatus.Confirmed) {
            let interval = new ThDateIntervalDO​​();
            interval.buildFromObject(booking.interval);
            let indexedBookingInterval = new IndexedBookingInterval(interval);
            let conditions = new PriceProductConditionsDO();
            conditions.buildFromObject(booking.priceProductSnapshot.conditions);
            booking.guaranteedTime = conditions.policy.generateGuaranteedTriggerTime({ arrivalDate: indexedBookingInterval.getArrivalDate() });
        }
    }
}
