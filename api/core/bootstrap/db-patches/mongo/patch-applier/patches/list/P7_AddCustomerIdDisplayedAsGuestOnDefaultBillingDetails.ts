import { MongoPatchType } from "../MongoPatchType";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { ThUtils } from "../../../../../../utils/ThUtils";

export class P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails extends APaginatedTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails;
    }

    protected getMongoRepository(): MongoRepository {
        return this._legacyBookingGroupRepository;
    }

    protected updateDocumentInMemory(bookingGroup) {
        bookingGroup.bookingList.forEach(booking => {
            if (!this._thUtils.isUndefinedOrNull(booking.defaultBillingDetails)
                && this._thUtils.isUndefinedOrNull(booking.defaultBillingDetails.customerIdDisplayedAsGuest)) {
                booking.defaultBillingDetails.customerIdDisplayedAsGuest =
                    booking.defaultBillingDetails.customerId;
            }
        });
        bookingGroup.versionId++;
    }
}