import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';
import {PaymentMethodDO} from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';

export class InvoiceAggregatedData {
    invoice: InvoiceDO;
    payerIndexOnInvoice: number;
    payerCustomer: CustomerDO;
    addOnProductList: AddOnProductDO[];
    vatList: TaxDO[];
    otherTaxes: TaxDO[];
    paymentMethodList: PaymentMethodDO[];       
}