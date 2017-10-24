import _ = require('underscore');
import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { InvoiceDO } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { SaveInvoiceDO } from "./SaveInvoiceDO";
import { ValidationResultParser } from "../../common/ValidationResultParser";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { CustomerIdValidator } from "../../customers/validators/CustomerIdValidator";
import { InvoicePayerDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";
import { CustomersContainer } from "../../customers/validators/results/CustomersContainer";
import { AddOnProductIdValidator } from "../../add-on-products/validators/AddOnProductIdValidator";
import { AddOnProductsContainer } from "../../add-on-products/validators/results/AddOnProductsContainer";
import { InvoicePaymentMethodDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { InvoicePaymentDO } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentDO";
import { InvoicePaymentMethodValidator } from "../validators/InvoicePaymentMethodValidator";
import { InvoicePayersValidator } from "../validators/InvoicePayersValidator";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThLogger, ThLogLevel } from "../../../utils/logging/ThLogger";
import { SaveInvoiceActionFactory } from "./actions/SaveInvoiceActionFactory";
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';

export class SaveInvoice {
    private invoiceToSave: InvoiceDO;
    private itemTransactionIdListToDelete: string[];
    private payerCustomerIdListToDelete: string[];

    private hotel: HotelDO;
    private customersContainer: CustomersContainer;
    private allPaymentMethods: PaymentMethodDO[];

    constructor(private appContext: AppContext, private sessionContext: SessionContext) {
    }

    // save an invoice and optionally send a list of items' transactions or payers' ids that will be deleted
    public save(invoice: InvoiceDO, itemTransactionIdListToDelete: string[] = [],
        payerCustomerIdListToDelete: string[] = []): Promise<InvoiceDO> {
        this.invoiceToSave = new InvoiceDO();
        this.invoiceToSave.buildFromObject(invoice);
        this.invoiceToSave.reindex();
        this.itemTransactionIdListToDelete = itemTransactionIdListToDelete;
        this.payerCustomerIdListToDelete = payerCustomerIdListToDelete;

        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.saveCore(resolve, reject);
        });
    }

    private saveCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveInvoiceDO.getValidationStructure().validateStructure(this.invoiceToSave);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.invoiceToSave);
            parser.logAndReject("Error validating data for saving invoice", reject);
            return;
        }
        this.appContext.getRepositoryFactory().getHotelRepository()
            .getHotelById(this.sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this.hotel = loadedHotel;

                let customerIdList: string[] = _.map(this.invoiceToSave.payerList, (payer: InvoicePayerDO) => { return payer.customerId; });
                var customerIdValidator = new CustomerIdValidator(this.appContext, this.sessionContext);
                return customerIdValidator.validateCustomerIdList(customerIdList);
            }).then((customersContainer: CustomersContainer) => {
                this.customersContainer = customersContainer;

                let settingsRepo = this.appContext.getRepositoryFactory().getSettingsRepository();
                return settingsRepo.getPaymentMethods();
            }).then((allPaymentMethods: PaymentMethodDO[]) => {
                this.allPaymentMethods = allPaymentMethods;

                var aopIdValidator = new AddOnProductIdValidator(this.appContext, this.sessionContext);
                return aopIdValidator.validateAddOnProductIdList(this.invoiceToSave.getAddOnProductIdList());
            }).then((aopContainer: AddOnProductsContainer) => {
                let pmValidators: Promise<InvoicePaymentMethodDO>[] = [];
                this.invoiceToSave.payerList.forEach((payer: InvoicePayerDO) => {
                    let customer = this.customersContainer.getCustomerById(payer.customerId);
                    payer.paymentList.forEach((payment: InvoicePaymentDO) => {
                        // only check if the payment method is enabled on new payments
                        let enforceEnabledPaymentMethods = true;
                        if (_.isString(payment.transactionId) && payment.transactionId.length > 0) {
                            enforceEnabledPaymentMethods = false;
                        }
                        let pmValidator = new InvoicePaymentMethodValidator(this.hotel, customer, this.allPaymentMethods);
                        pmValidators.push(pmValidator.validate(payment.paymentMethod, enforceEnabledPaymentMethods));
                    });
                });
                return Promise.all(pmValidators);
            }).then((validatedPaymentMethodList: InvoicePaymentMethodDO[]) => {
                let payersValidator = new InvoicePayersValidator(this.customersContainer);
                return payersValidator.validate(this.invoiceToSave);
            }).then((validatedInvoice: InvoiceDO) => {
                if (this.invoiceContainsTheSamePayerMoreThanOnce()) {
                    var thError = new ThError(ThStatusCode.SaveInvoiceSamePayerAddedMoreThanOnce, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "same payer added more than once", this.invoiceToSave, thError);
                    throw thError;
                }

                var actionFactory = new SaveInvoiceActionFactory(this.appContext, this.sessionContext);
                var actionStrategy = actionFactory.getActionStrategy(this.invoiceToSave, this.itemTransactionIdListToDelete, this.payerCustomerIdListToDelete);
                actionStrategy.saveInvoice(resolve, reject);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.SaveInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice", this.invoiceToSave, thError);
                reject(thError);
            });
    }

    private invoiceContainsTheSamePayerMoreThanOnce(): boolean {
        let customerIdList: string[] = _.map(this.invoiceToSave.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId;
        });
        let uniqueCustomerIdList: string[] = _.uniq(customerIdList);
        return customerIdList.length != uniqueCustomerIdList.length;
    }
}
