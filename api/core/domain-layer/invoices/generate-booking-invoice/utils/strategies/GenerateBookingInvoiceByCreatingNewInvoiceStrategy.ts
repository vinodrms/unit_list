import { AppContext } from "../../../../../utils/AppContext";
import { SessionContext } from "../../../../../utils/SessionContext";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { AGenerateBookingInvoiceActionStrategy } from "../AGenerateBookingInvoiceActionStrategy";
import { InvoiceDO, InvoiceStatus, InvoicePaymentStatus } from "../../../../../data-layer/invoices/data-objects/InvoiceDO";
import { BookingDO } from "../../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingInvoiceItem } from "../../GenerateBookingInvoiceDO";
import { CustomerIdValidator } from "../../../../customers/validators/CustomerIdValidator";
import { CustomersContainer } from "../../../../customers/validators/results/CustomersContainer";
import { CustomerDO } from "../../../../../data-layer/customers/data-objects/CustomerDO";
import { TaxDO } from "../../../../../data-layer/taxes/data-objects/TaxDO";
import { TaxResponseRepoDO } from "../../../../../data-layer/taxes/repositories/ITaxRepository";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoicePayerDO } from "../../../../../data-layer/invoices/data-objects/payer/InvoicePayerDO";

export interface GenerateBookingInvoiceByCreatingNewInvoiceStrategyParams {
    booking: BookingDO;
    initialInvoiceItemList: BookingInvoiceItem[];
    invoiceGroupId: string;
}

export class GenerateBookingInvoiceByCreatingNewInvoiceStrategy extends AGenerateBookingInvoiceActionStrategy {
    private defaultBillingCustomer: CustomerDO;
    private vatTaxListSnapshot: TaxDO[];

    constructor(appContext: AppContext, sessionContext: SessionContext,
        private params: GenerateBookingInvoiceByCreatingNewInvoiceStrategyParams) {
        super(appContext, sessionContext, params.booking, params.initialInvoiceItemList);
    }

    generateBookingInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var customerIdValidator = new CustomerIdValidator(this.appContext, this.sessionContext);
        customerIdValidator.validateCustomerIdList([this.params.booking.defaultBillingDetails.customerId])
            .then((customersContainer: CustomersContainer) => {
                this.defaultBillingCustomer = customersContainer.customerList[0];

                let taxRepo = this.appContext.getRepositoryFactory().getTaxRepository();
                return taxRepo.getTaxList({ hotelId: this.sessionContext.sessionDO.hotel.id });
            }).then((result: TaxResponseRepoDO) => {
                this.vatTaxListSnapshot = result.vatList;

                let transientInvoice = this.getDefaultInvoiceDO();
                let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
                return invoiceRepo.addInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, transientInvoice);
            }).then((createdInvoice: InvoiceDO) => {
                createdInvoice.recomputePrices();
                let invoiceRepo = this.appContext.getRepositoryFactory().getInvoiceRepository();
                return invoiceRepo.updateInvoice({ hotelId: this.sessionContext.sessionDO.hotel.id }, {
                    id: createdInvoice.id,
                    versionId: createdInvoice.versionId
                }, createdInvoice);
            }).then((updatedInvoice: InvoiceDO) => {
                resolve(updatedInvoice)
            }).catch(e => {
                reject(e);
            });
    }

    private getDefaultInvoiceDO(): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.versionId = 0;
        invoice.hotelId = this.sessionContext.sessionDO.hotel.id;
        invoice.status = InvoiceStatus.Active;
        invoice.groupId = this.params.invoiceGroupId;
        invoice.amountPaid = 0.0;
        invoice.amountToPay = 0.0;
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;
        invoice.vatTaxListSnapshot = this.vatTaxListSnapshot;
        invoice.notesFromBooking = this.params.booking.invoiceNotes;
        invoice.itemList = this.getInvoiceItemList();
        let payer = new InvoicePayerDO();
        payer.customerId = this.defaultBillingCustomer.id;
        payer.paymentList = [];
        invoice.payerList = [payer];
        return invoice;
    }
}
