import {ThUtils} from '../../../../../utils/ThUtils';
import {BaseDO} from '../../../../common/base/BaseDO';
import {IInvoiceItemMeta} from '../IInvoiceItemMeta';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {CustomerDO} from '../../../../customers/data-objects/CustomerDO';
import {BaseCorporateDetailsDO} from '../../../../customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';

export class FeeInvoiceItemMetaDO extends BaseDO implements IInvoiceItemMeta {
    movable: boolean;

    pricePerItem: number;
    numberOfItems: number;
    displayName: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["movable", "pricePerItem", "numberOfItems", "displayName"];
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

    public buildFromCustomerDO(customerDO: CustomerDO) {
        this.movable = false;
        this.numberOfItems = 1;
        this.displayName = 'Pay Invoice By Agreement Fee';
        var corporateDetails = new BaseCorporateDetailsDO();
        corporateDetails.buildFromObject(customerDO.customerDetails);
        this.pricePerItem = corporateDetails.invoiceFee;
    }
}