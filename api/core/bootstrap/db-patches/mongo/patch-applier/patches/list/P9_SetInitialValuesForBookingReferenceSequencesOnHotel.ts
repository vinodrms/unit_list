import { ATransactionalMongoPatch } from "../../utils/ATransactionalMongoPatch";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";

export class P9_SetInitialValuesForBookingReferenceSequencesOnHotel extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.SetInitialValuesForBookingReferenceSequencesOnHotel;
    }
    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {

        var noUpdated = 0;
        async.doWhilst((finishSingleUpdateCallback) => {
            this._hotelRepository.updateMultipleDocuments({
                    "sequences.bookingGroupSequence": null,
                    "sequences.bookingItemSequence": null
                },
                {
                    "sequences.bookingGroupSequence": 0,
                    "sequences.bookingItemSequence": 0
                }, ((err: any) => {
                    finishSingleUpdateCallback(err);
                }), ((noUpdatedAtCurrentStep: number) => {
                    noUpdated = noUpdatedAtCurrentStep;
                    finishSingleUpdateCallback(null);
                }));
    }, () => {
            return noUpdated > 0;
        }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    }
}