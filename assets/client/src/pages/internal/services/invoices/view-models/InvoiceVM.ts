import {InvoiceDO} from '../data-objects/InvoiceDO';
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

export class InvoiceVM {
    private static NO_ITEMS_ADDED_ERROR = 'Add at least an item.';
    private static NO_PAYERS_ADDED_ERROR = 'Add at least a payer.';
    private static EACH_PAYER_ENTRY_SHOULD_HAVE_A_CUSTOMER_SELECTED_ERROR = 'Select a customer for each payer entry.';
    private static MORE_THAN_ONE_COMPANY_OR_TA_PAYER_ERROR = 'You can share an invoice only between individuals.';
    private static TOTAL_PRICE_DIFFERENT_THAN_TOTAL_PAID = 'Total amount paid should equal total price.';

    errorMessageList: string[];
    invoiceDO: InvoiceDO;
    invoicePayerVMList: InvoicePayerVM[];
    invoceItemVMList: InvoiceItemVM[];
    newlyAdded: boolean;

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
        invoicePayerVM.newlyAdded = true;
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
        newInvoicePayerVM.invoicePayerDO.priceToPay = this.totalPrice - this.amountPaid;
        newInvoicePayerVM.newlyAdded = true;
        this.invoicePayerVMList.push(newInvoicePayerVM);

        this.isValid();
    }

    public addItemOnInvoice(aop: AddOnProductDO, qty: number) {
        var newInvoiceItem = new InvoiceItemDO();
        newInvoiceItem.id = aop.id;
        newInvoiceItem.type = InvoiceItemType.AddOnProduct;

        var invoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        invoiceItemMeta.aopDisplayName = aop.name;
        invoiceItemMeta.movable = true;
        invoiceItemMeta.numberOfItems = qty;
        invoiceItemMeta.pricePerItem = aop.price;
        newInvoiceItem.meta = invoiceItemMeta;

        var newInvoiceItemVM = new InvoiceItemVM(this._thTranslation);
        newInvoiceItemVM.buildFromInvoiceItem(newInvoiceItem);

        this.invoiceDO.itemList.push(newInvoiceItem);
        this.invoceItemVMList.push(newInvoiceItemVM);

        this.isValid();
    }

    public isValid(): boolean {
        this.errorMessageList = [];

        this.validateNumberOfPayers();
        this.validateNumberOfItems();
        this.validateAmountPaid();
        this.validateNumberOfCompanyOrTaPayers();

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
    private validateNumberOfCompanyOrTaPayers() {
        if (this.invoicePayerVMList.length < 2) return;

        var thUtils = new ThUtils();
        var companyOrTaCounter = 0;
        for (var i = 0; i < this.invoicePayerVMList.length; ++i) {
            if (!thUtils.isUndefinedOrNull(this.invoicePayerVMList[i].customerDO)) {
                if (this.invoicePayerVMList[i].customerDO.isCompanyOrTravelAgency()) {
                    companyOrTaCounter++;
                    if (companyOrTaCounter > 1) {
                        this.errorMessageList.push(InvoiceVM.MORE_THAN_ONE_COMPANY_OR_TA_PAYER_ERROR);
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
}