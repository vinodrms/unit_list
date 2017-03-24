import { PriceProductDiscountDO } from "../../../../../../../../../../../services/price-products/data-objects/discount/PriceProductDiscountDO";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";

export interface PriceProductDiscountModalResult {
    discount: PriceProductDiscountDO;
    customerList: CustomerDO[];
}