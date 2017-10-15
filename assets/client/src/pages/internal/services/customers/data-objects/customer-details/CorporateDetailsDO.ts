import * as _ from "underscore";
import { BaseDO } from '../../../../../../common/base/BaseDO';
import { AddressDO } from '../../../common/data-objects/address/AddressDO';
import { CommissionDO } from '../../../common/data-objects/commission/CommissionDO';
import { ICustomerDetailsDO } from './ICustomerDetailsDO';
import { ContactDetailsDO } from './ContactDetailsDO';

export class CorporateDetailsDO extends BaseDO implements ICustomerDetailsDO {
    constructor() {
        super();
    }
    vatCode: string;
    governmentCode: string;
    name: string;
    address: AddressDO;
    websiteUrl: string;
    payInvoiceByAgreement: boolean;
    invoiceFee: number;
    accountNo: string;
    commission: CommissionDO;
    receiveBookingConfirmations: boolean;
    contactDetailsList: ContactDetailsDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["vatCode", "governmentCode", "name", "websiteUrl", "payInvoiceByAgreement",
            "invoiceFee", "accountNo", "receiveBookingConfirmations"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        this.address = new AddressDO();
        this.address.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "address"));

        this.commission = new CommissionDO();
        this.commission.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "commission"));
        this.contactDetailsList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "contactDetailsList"), (contactDetailsObject: Object) => {
            var contactDetailsDO = new ContactDetailsDO();
            contactDetailsDO.buildFromObject(contactDetailsObject);
            this.contactDetailsList.push(contactDetailsDO);
        });
    }
    public getAddress(): AddressDO {
        return this.address;
    }
    public getName(): string {
        return this.name;
    }
    public canPayInvoiceByAgreement(): boolean {
        return this.payInvoiceByAgreement;
    }
    public getPayInvoiceByAgreementFee(): number {
        if (!_.isNumber(this.invoiceFee)) { return 0.0; }
        return this.invoiceFee;
    }
    public canGuaranteePayment(): boolean {
        return this.payInvoiceByAgreement;
    }
    public canReceiveBookingConfirmations(): boolean {
        return this.receiveBookingConfirmations;
    }
    public getContactDetailsList(): ContactDetailsDO[] {
        return this.contactDetailsList;
    }
}
