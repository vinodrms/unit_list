import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {AddOnProductsContainer} from '../../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {CustomersContainer} from '../../../domain-layer/customers/validators/results/CustomersContainer';
import {PriceProductsContainer} from '../../../domain-layer/price-products/validators/results/PriceProductsContainer';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';

export class InvoicePriceCalculator {
    private _thUtils: ThUtils;

    constructor(private _invoice: InvoiceDO, private _customersContainer: CustomersContainer,
        private _aopsContainer: AddOnProductsContainer, private _ppsContainer: PriceProductsContainer) {
        this._thUtils = new ThUtils();
    }

    public getTotalPrice(): number {
        var totalPrice = 0;

        return totalPrice;
    }

    private getPriceForAllAddOnProducts(): number {
        return _.chain(this._aopsContainer.aopList)
            .map((aop: AddOnProductDO) => {
                return aop.price;
            }).reduce((totalPrice, price: number) => {
                return totalPrice + price;
            }, 0).value();
    }

    //TODO pp - get total price by config capacity
    private getPriceForAllPriceProducts(): number {
        
        return 0;
    }

    private getFeeForInvoicePayment(): number {
        // this._customersContainer.getCustomerById();
        
        return 0;
    }
}