import { APaginatedTransactionalMongoPatch } from "../../utils/APaginatedTransactionalMongoPatch";
import { MongoRepository } from "../../../../../../data-layer/common/base/MongoRepository";
import { MongoPatchType } from "../MongoPatchType";
import { CustomerDO, CustomerType } from "../../../../../../data-layer/customers/data-objects/CustomerDO";
import { ContactDetailsDO }from "../../../../../../data-layer/customers/data-objects/customer-details/ContactDetailsDO";
import { ThUtils } from "../../../../../../../core/utils/ThUtils";

export class P18_CreateContactDetailsListOnCustomerDetails extends APaginatedTransactionalMongoPatch {

    protected getMongoRepository(): MongoRepository {
        return this._customerRepository;
    }

    public getPatchType(): MongoPatchType {
        return MongoPatchType.CreateContactDetailsListOnCustomerDetails;
    }

    protected updateDocumentInMemory(customer) {
        P18_CreateContactDetailsListOnCustomerDetails.createContactDetailsList(customer);
        customer.versionId++;
    }

    public static createContactDetailsList(customer: CustomerDO) {
        let thUtils = new ThUtils();
        let contactDetails = new ContactDetailsDO();
        let email = customer.customerDetails["email"];
        if (!thUtils.isUndefinedOrNull(email)) {
            delete customer.customerDetails["email"];
            contactDetails.email = email;
        }
        let fax = customer.customerDetails["fax"];
        if (!thUtils.isUndefinedOrNull(fax)) {
            delete customer.customerDetails["fax"];
            contactDetails.fax = fax;
        }
        let phone = customer.customerDetails["phone"];
        if (!thUtils.isUndefinedOrNull(phone)) {
            delete customer.customerDetails["phone"];
            contactDetails.phone = phone;
        }
        let contactName = "";
        if (customer.type == CustomerType.Company || customer.type == CustomerType.TravelAgency) {
            contactName = customer.customerDetails["contactName"];
            delete customer.customerDetails["contactName"];
            if (!contactName || contactName.length == 0) {
                contactName = customer.customerDetails["name"];
            }
        }
        else {
            contactName = customer.customerDetails["firstName"] + " " + customer.customerDetails["lastName"];
        }
        contactDetails.contactName = contactName;
        customer.customerDetails["contactDetailsList"] = [contactDetails];
    }
}