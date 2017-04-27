import { ThUtils } from '../../../../../utils/ThUtils';
import { BaseDO } from '../../../../common/base/BaseDO';
import { IInvoiceItemMeta } from '../IInvoiceItemMeta';
import { ThTranslation } from '../../../../../utils/localization/ThTranslation';
import { CustomerDO } from '../../../../customers/data-objects/CustomerDO';
import { BaseCorporateDetailsDO } from '../../../../customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';

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
    public getDisplayName(thTranslation: ThTranslation): string {
        return thTranslation.translate(this.displayName);
    }
    public isMovable(): boolean {
        return false;
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
        var corporateDetails = new BaseCorporateDetailsDO();
        corporateDetails.buildFromObject(customerDO.customerDetails);
        this.pricePerItem = corporateDetails.invoiceFee;
    }
}