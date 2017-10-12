import { BaseDO } from '../../../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../../../common/utils/ThUtils';
import { IInvoiceItemMeta } from '../IInvoiceItemMeta';
import { ThTranslation } from '../../../../../../../common/utils/localization/ThTranslation';
import { CustomerDO } from '../../../../customers/data-objects/CustomerDO';
import { CorporateDetailsDO } from "../../../../customers/data-objects/customer-details/CorporateDetailsDO";

export class FeeInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    pricePerItem: number;
    vatId: string;
    numberOfItems: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["pricePerItem", "vatId", "numberOfItems", "displayName"];
    }

    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getTotalPrice(): number {
        return this.getUnitPrice() * this.getNumberOfItems();
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.displayName);
    }
    public isDerivedFromBooking(): boolean {
        return true;
    }
    public getVatId(): string {
        return this.vatId;
    }
    public buildFromCustomerDO(customerDO: CustomerDO) {
        this.numberOfItems = 1;
        this.displayName = 'Pay Invoice By Agreement Fee';
        var corporateDetails = new CorporateDetailsDO();
        corporateDetails.buildFromObject(customerDO.customerDetails);
        this.pricePerItem = corporateDetails.invoiceFee;
    }
}
