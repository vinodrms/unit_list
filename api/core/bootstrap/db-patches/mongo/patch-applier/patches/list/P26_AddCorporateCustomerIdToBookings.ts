import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { ThError } from "../../../../../../utils/th-responses/ThError";
import { CustomerSearchResultRepoDO } from "../../../../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomersContainer } from "../../../../../../domain-layer/customers/validators/results/CustomersContainer";

export class P26_AddCorporateCustomerIdToBookings extends APaginatedTransactionalMongoPatch {

    protected updateDocumentInMemory(booking) {
    }

    protected getMongoRepository(): MongoRepository {
        return this._bookingRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddCorporateCustomerIdToBookings;
    }

    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, booking) {
        var custRepo = this._customerRepository;
        custRepo.getCustomerList({ hotelId: booking["hotelId"] }, { customerIdList: booking["customerIdList"] })
            .then((searchResult: CustomerSearchResultRepoDO) => {
                var customersContainer = new CustomersContainer(searchResult.customerList);
                var corporateDisplayCustomerId = "";
                booking["customerIdList"].forEach(customerId => {
                    var currentCustomer = customersContainer.getCustomerById(customerId);
                    if (currentCustomer.isCompanyOrTravelAgency()) {
                        corporateDisplayCustomerId = customerId;
                        return;
                    }
                });
                booking["corporateDisplayCustomerId"] = corporateDisplayCustomerId;
                booking["versionId"]++;
                resolve(booking);
            }).catch(e => {
                reject(e);
            });
    }
}