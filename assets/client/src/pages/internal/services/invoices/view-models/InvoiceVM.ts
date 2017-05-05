import { InvoiceDO, InvoiceAccountingType } from '../data-objects/InvoiceDO';
import {InvoicePayerDO} from '../data-objects/payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from '../data-objects/items/InvoiceItemDO';
import {InvoicePayerVM} from './InvoicePayerVM';
import {InvoiceItemVM} from './InvoiceItemVM';
import {CustomersDO} from '../../customers/data-objects/CustomersDO';
import {CustomerDO} from '../../customers/data-objects/CustomerDO';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';
import {AddOnProductDO} from '../../add-on-products/data-objects/AddOnProductDO';
import {AddOnProductInvoiceItemMetaDO} from '../data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import {ThUtils} from '../../../../../common/utils/ThUtils';
import {InvoicePaymentMethodType} from '../data-objects/payers/InvoicePaymentMethodDO';

export class InvoiceVM {
    private static NO_ITEMS_ADDED_ERROR = 'Add at least an item.';
    private static NO_PAYERS_ADDED_ERROR = 'Add at least a payer.';
    private static EACH_PAYER_ENTRY_SHOULD_HAVE_A_CUSTOMER_SELECTED_ERROR = 'Select a customer for each payer entry.';
    private static SHARED_AND_PAY_BY_AGREEMENT_SELECTED_ERROR = 'You cannot share an invoice if one of the payers has \'pay invoice by agreement\' as payment method.';
    private static TOTAL_PRICE_DIFFERENT_THAN_TOTAL_PAID = 'Total amount paid should equal total price.';

    errorMessageList: string[];
    invoiceDO: InvoiceDO;
    invoicePayerVMList: InvoicePayerVM[];
    invoceItemVMList: InvoiceItemVM[];
    newlyAdded: boolean;

    private _credited: boolean;

    constructor(private _thTranslation: ThTranslation) {
        this.errorMessageList = [];
    }

    public buildCleanInvoiceVM(invoiceReference: string) {
        this.invoiceDO = new InvoiceDO();
        this.invoiceDO.buildCleanInvoice();
        this.invoiceDO.invoiceReference = invoiceReference;
        this.invoicePayerVMList = [];
        var invoicePayerVM = new InvoicePayerVM(this._thTranslation);
        invoicePayerVM.invoicePayerDO = this.invoiceDO.payerList[0];
        this.invoicePayerVMList.push(invoicePayerVM);
        this.invoceItemVMList = [];
        this.newlyAdded = true;
    }

    public buildFromInvoiceDOAndCustomersDO(invoice: InvoiceDO, customersDO: CustomersDO) {
        this.invoiceDO = invoice;

        this.invoicePayerVMList = [];
        _.forEach(this.invoiceDO.payerList, (invoicePayerDO: InvoicePayerDO) => {
            var invoicePayerVM = new InvoicePayerVM(this._thTranslation);
            invoicePayerVM.buildFromInvoicePayerDOAndCustomersDO(invoicePayerDO, customersDO);
            this.invoicePayerVMList.push(invoicePayerVM);
        });

        this.invoceItemVMList = [];
        _.forEach(this.invoiceDO.itemList, (invoiceItemDO: InvoiceItemDO) => {
            var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
            invoiceItemVM.buildFromInvoiceItem(invoiceItemDO);
            this.invoceItemVMList.push(invoiceItemVM);
        });
    }

    public get totalPrice(): number {
        return this.invoiceDO.getPrice();
    }
    public get isNewlyAdded(): boolean {
        return this.newlyAdded;
    }

    public addInvoicePayer(customerDO: CustomerDO) {
        var newInvoicePayerVM = new InvoicePayerVM(this._thTranslation);
        newInvoicePayerVM.buildFromCustomerDO(customerDO);
        this.invoicePayerVMList.push(newInvoicePayerVM);
        var thUtils = new ThUtils();
        var equalSharePrice = thUtils.roundNumberToTwoDecimals(this.totalPrice / this.invoicePayerVMList.length);
        _.forEach(this.invoicePayerVMList, (invoicePayerVM: InvoicePayerVM) => {
            invoicePayerVM.invoicePayerDO.priceToPay = equalSharePrice;
        });

        this.invoicePayerVMList[0].invoicePayerDO.priceToPay = 
            thUtils.roundNumberToTwoDecimals(this.invoicePayerVMList[0].invoicePayerDO.priceToPay + this.totalPrice - this.amountPaid);

        this.isValid();
    }

    public addItemOnInvoice(aop: AddOnProductDO, qty: number) {
        var newInvoiceItem = new InvoiceItemDO();
        newInvoiceItem.id = aop.id;
        newInvoiceItem.type = InvoiceItemType.AddOnProduct;

        var invoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        invoiceItemMeta.aopDisplayName = aop.name;
        invoiceItemMeta.numberOfItems = qty;
        invoiceItemMeta.pricePerItem = aop.price;
        if(_.isArray(aop.taxIdList) && !_.isEmpty(aop.taxIdList)) {
            invoiceItemMeta.vatId = aop.taxIdList[0];
        }
        else {
            invoiceItemMeta.vatId = null;
        }
        newInvoiceItem.meta = invoiceItemMeta;

        var newInvoiceItemVM = new InvoiceItemVM(this._thTranslation);
        newInvoiceItemVM.buildFromInvoiceItem(newInvoiceItem);

        this.invoiceDO.itemList.push(newInvoiceItem);
        this.invoceItemVMList.push(newInvoiceItemVM);

        this.isValid();
    }

    public set credited(value: boolean) {
        this._credited = value;
    }
    public get credited(): boolean {
        return this._credited;
    }

    public isValid(): boolean {
        this.errorMessageList = [];

        this.validateNumberOfPayers();
        this.validateNumberOfItems();
        this.validateAmountPaid();
        this.validateNumberOfCompanyPayersWithPayByAgreementAsPM();

        return _.isEmpty(this.errorMessageList);
    }

    private validateNumberOfItems() {
        if (_.isEmpty(this.invoceItemVMList)) {
            this.errorMessageList.push(InvoiceVM.NO_ITEMS_ADDED_ERROR);
        }
    }
    private validateNumberOfPayers() {
        if (_.isEmpty(this.invoicePayerVMList)) {
            this.errorMessageList.push(InvoiceVM.NO_PAYERS_ADDED_ERROR);
            return;
        }

        var thUtils = new ThUtils();
        var noOfEmptyPayers = _.reduce(this.invoicePayerVMList, (totalNo: number, invoicePayerVM: InvoicePayerVM) => {
            if (thUtils.isUndefinedOrNull(invoicePayerVM.customerDO)) {
                return totalNo + 1;
            }
            return totalNo;
        }, 0);
        if (noOfEmptyPayers === this.invoicePayerVMList.length) {
            this.errorMessageList.push(InvoiceVM.EACH_PAYER_ENTRY_SHOULD_HAVE_A_CUSTOMER_SELECTED_ERROR);
        }
    }
    private validateAmountPaid() {
        if (this.amountPaid != this.totalPrice) {
            this.errorMessageList.push(InvoiceVM.TOTAL_PRICE_DIFFERENT_THAN_TOTAL_PAID);
        }
    }
    private get amountPaid(): number {
        var amountPaid = 0;
        _.forEach(this.invoicePayerVMList, (invoicePayerVM: InvoicePayerVM) => {
            amountPaid += invoicePayerVM.invoicePayerDO.priceToPay;
        });
        return amountPaid;
    }

    private validateNumberOfCompanyPayersWithPayByAgreementAsPM() {
        if (this.invoicePayerVMList.length < 2) return;

        var thUtils = new ThUtils();
        var hasAtLeastOnePayerWithPayByAgreement = false;
        for (var i = 0; i < this.invoicePayerVMList.length; ++i) {
            var invoicePayerVM = this.invoicePayerVMList[i];
            if (!thUtils.isUndefinedOrNull(invoicePayerVM.customerDO)) {
                if (invoicePayerVM.customerDO.isCompanyOrTravelAgency()) {
                    if (thUtils.isUndefinedOrNull(invoicePayerVM.invoicePayerDO.paymentMethod)) {
                        continue;
                    }
                    if (invoicePayerVM.invoicePayerDO.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                        this.errorMessageList.push(InvoiceVM.SHARED_AND_PAY_BY_AGREEMENT_SELECTED_ERROR);
                        return;
                    }
                }
            }
        }
    }

    public buildPrototype(): InvoiceVM {
        var invoiceVMCopy = new InvoiceVM(this._thTranslation);

        invoiceVMCopy.newlyAdded = this.newlyAdded;

        var invoiceDOCopy = new InvoiceDO();
        invoiceDOCopy.buildFromObject(this.invoiceDO);
        invoiceVMCopy.invoiceDO = invoiceDOCopy;

        invoiceVMCopy.invoceItemVMList = [];
        _.forEach(this.invoceItemVMList, (invoiceItemVM: InvoiceItemVM) => {
            invoiceVMCopy.invoceItemVMList.push(invoiceItemVM.buildPrototype());
        });

        invoiceVMCopy.invoicePayerVMList = [];
        _.forEach(this.invoicePayerVMList, (invoicePayerVM: InvoicePayerVM) => {
            invoiceVMCopy.invoicePayerVMList.push(invoicePayerVM.buildPrototype());
        })

        return invoiceVMCopy;
    }

    public addOrRemoveInvoiceFeeIfNecessary(customerDOList: CustomerDO[]) {
        if (!this.hasPayInvoiceByAgreementAsPM()) {
            var index = _.findIndex(this.invoceItemVMList, (invoiceItemVM: InvoiceItemVM) => {
                return invoiceItemVM.invoiceItemDO.type === InvoiceItemType.InvoiceFee;
            });
            if (index != -1) {
                this.invoceItemVMList.splice(index, 1);
                this.invoiceDO.itemList.splice(index, 1);
            }
            return;
        }

        for (var i = 0; i < this.invoicePayerVMList.length; ++i) {
            if (this.invoicePayerVMList[i].invoicePayerDO.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                var customerDO = _.find(customerDOList, (customerDO: CustomerDO) => {
                    return customerDO.id === this.invoicePayerVMList[i].invoicePayerDO.customerId;
                });

                var index = _.findIndex(this.invoceItemVMList, (invoiceItemVM: InvoiceItemVM) => {
                    return invoiceItemVM.invoiceItemDO.type === InvoiceItemType.InvoiceFee;
                });
                if (index === -1) {
                    var invoiceFeeItem = new InvoiceItemDO();
                    invoiceFeeItem.buildFeeItemFromCustomerDO(customerDO);

                    var invoiceItemVM = new InvoiceItemVM(this._thTranslation);
                    invoiceItemVM.buildFromInvoiceItem(invoiceFeeItem);

                    this.invoceItemVMList.push(invoiceItemVM);
                    this.invoiceDO.itemList.push(invoiceFeeItem);
                }
                return;
            }
        }
    }

    public hasPayInvoiceByAgreementAsPM(): boolean {
        for (var i = 0; i < this.invoicePayerVMList.length; ++i) {
            if (this.invoicePayerVMList[i].invoicePayerDO.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
                return true;
            }
        }
        return false;
    }
}