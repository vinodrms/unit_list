import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { HotelDO } from "../../../../../../data-layer/hotel/data-objects/HotelDO";
import { PaymentMethodInstanceDO } from "../../../../../../data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";

export class P16_TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._hotelRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.EncapsulateDiscountInBookingPricePerDayOnBookings;
    }

    protected updateDocumentInMemory(hotel) {
        P16_TransformPaymentMetehodIdListOnHotelIntoPaymentMethodInstanceList.replacePMIdListWithPMInstanceList(hotel);
        hotel.versionId++;
    }

    public static replacePMIdListWithPMInstanceList(hotel: HotelDO) {
        let paymentMethodIdList = hotel["paymentMethodIdList"];

        if(_.isArray(paymentMethodIdList)) {
            delete hotel["paymentMethodIdList"];

            hotel.paymentMethodList = [];
            _.forEach(paymentMethodIdList, (paymentMethodId: string) => {
                let pmInstance = new PaymentMethodInstanceDO();
                pmInstance.paymentMethodId = paymentMethodId;
                pmInstance.transactionFee = null;
                hotel.paymentMethodList.push(pmInstance);
            });
        }
    }

}