import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ThError } from '../../../../../../utils/th-responses/ThError';

export class P8_AddMergeInvoiceToBookings extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddMergeInvoiceToBookings;
    }

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        this._bookingRepository.updateMultipleDocuments({
            "mergeInvoice": null
        },
            {
                "mergeInvoice": false
            }, ((err: any) => {
                reject(err);
            }), ((noUpdatedAtCurrentStep: number) => {
                resolve(true);
            }));

    }
}
