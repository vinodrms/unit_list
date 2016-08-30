import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../../common/utils/ThUtils';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';
import {CustomerDO} from '../../../../customers/data-objects/CustomerDO';
import {CorporateDetailsDO} from '../../../../customers/data-objects/customer-details/CorporateDetailsDO';

export class FeeInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    pricePerItem: number;
    vatValue: number;
    numberOfItems: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "pricePerItem", "vatValue", "numberOfItems", "displayName"];
    }

    public getUnitPrice(): number {
        return this.pricePerItem;
    }
    public getNumberOfItems(): number {
        return this.numberOfItems;
    }
    public getDisplayName(thTranslation: ThTranslation): string {
        return this.displayName;
    }
    public setMovable(movable: boolean) {
        this.movable = movable;
    }
    public isMovable(): boolean {
        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(this.movable)) {
            return true;
        }
        return this.movable;
    }
    public getVatValue(): number {
        return this.vatValue;
    }
    public buildFromCustomerDO(customerDO: CustomerDO) {
        this.movable = false;
        this.numberOfItems = 1;
        this.displayName = 'Pay Invoice By Agreement Fee';
        var corporateDetails = new CorporateDetailsDO();
        corporateDetails.buildFromObject(customerDO.customerDetails);
        this.pricePerItem = corporateDetails.invoiceFee;
    }
}