import { MongoPatchType } from "../MongoPatchType";
import { ABookingGroupTransactionalMongoPatch } from "../../utils/ABookingGroupTransactionalMongoPatch";
import { ThUtils } from "../../../../../../utils/ThUtils";

export class P7_AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails extends ABookingGroupTransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddCustomerIdDisplayedAsGuestOnDefaultBillingDetails;
    }

    protected updateBookingGroupInMemory(bookingGroup) {
        var thUtils = new ThUtils();

        bookingGroup.bookingList.forEach(booking => {
            if (!thUtils.isUndefinedOrNull(booking.defaultBillingDetails)
                && thUtils.isUndefinedOrNull(booking.defaultBillingDetails.customerIdDisplayedAsGuest)) {
                booking.defaultBillingDetails.customerIdDisplayedAsGuest =
                    booking.defaultBillingDetails.customerId;
            }
        });
        bookingGroup.versionId++;
    }
}