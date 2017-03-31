import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { CustomerType } from "../../../../../../data-layer/customers/data-objects/CustomerDO";

export class P12_AddDeductedOnCustomerCommissions extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddDeductedOnCustomerCommissions;
    }
    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        this._customerRepository.updateMultipleDocuments({
            $or: [
                { "type": CustomerType.Company },
                { "type": CustomerType.TravelAgency }
            ],
            "customerDetails.commission.deducted": null
        },
            {
                "customerDetails.commission.deducted": false
            }, ((err: any) => {
                reject(err);
            }), ((noUpdatedAtCurrentStep: number) => {
                resolve(true);
            }));
    }
}