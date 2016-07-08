import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {AddNewBookingInvoiceGroupDO} from './AddNewBookingInvoiceGroupDO';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {BookingIdValidator} from '../validators/BookingIdValidator';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {InvoicePayerDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {CustomerIdValidator} from '../../customers/validators/CustomerIdValidator';
import {CustomerDO, CustomerType} from '../../../data-layer/customers/data-objects/CustomerDO';
import {CustomersContainer} from '../../customers/validators/results/CustomersContainer';
import {BaseCorporateDetailsDO} from '../../../data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';
import {InvoicePriceCalculator} from '../utils/InvoicePriceCalculator';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';

export class AddNewBookingInvoiceGroup {
    private _thUtils: ThUtils;
    private _addNewBookingInvoiceGroupDO: AddNewBookingInvoiceGroupDO;

    private _loadedBooking: BookingDO;
    private _loadedDefaultBillingCustomer: CustomerDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public addNewBookingInvoiceGroup(addNewBookingInvoiceGroupDO: AddNewBookingInvoiceGroupDO): Promise<InvoiceGroupDO> {
        this._addNewBookingInvoiceGroupDO = addNewBookingInvoiceGroupDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.addNewBookingInvoiceGroupCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddNewBookingInvoiceGroupError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding new booking related invoice gorup", this._addNewBookingInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private addNewBookingInvoiceGroupCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = AddNewBookingInvoiceGroupDO.getValidationStructure().validateStructure(this._addNewBookingInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._addNewBookingInvoiceGroupDO);
            parser.logAndReject("Error validating data for adding new booking related invoice group", reject);
            return;
        }

        var bookingIdValidator = new BookingIdValidator(this._appContext, this._sessionContext);
        bookingIdValidator.validateBookingId(this._addNewBookingInvoiceGroupDO.groupBookingId, this._addNewBookingInvoiceGroupDO.bookingId).then((booking: BookingDO) => {
            this._loadedBooking = booking;

            var customerIdValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerIdValidator.validateCustomerIdList([this._loadedBooking.defaultBillingDetails.customerId]);
        }).then((loadedCustomersContainer: CustomersContainer) => {
            this._loadedDefaultBillingCustomer = loadedCustomersContainer.customerList[0];

            var invoiceGroupsRepository = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
            return invoiceGroupsRepository.addInvoiceGroup({ hotelId: this._sessionContext.sessionDO.hotel.id }, this.getInvoiceGroupDO());
        }).then((savedInvoiceGroup: InvoiceGroupDO) => {
            resolve(savedInvoiceGroup);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.AddBookingInvoiceGroupItemError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding invoice group related to booking", this._addNewBookingInvoiceGroupDO, thError);
            }
            reject(thError);
        });
    }

    private getInvoiceGroupDO(): InvoiceGroupDO {
        var invoiceGroup = new InvoiceGroupDO();

        invoiceGroup.hotelId = this._sessionContext.sessionDO.hotel.id;
        invoiceGroup.groupBookingId = this._loadedBooking.groupBookingId;
        invoiceGroup.bookingId = this._loadedBooking.bookingId;
        invoiceGroup.paymentStatus = InvoicePaymentStatus.Open;

        invoiceGroup.invoiceList = [];
        invoiceGroup.invoiceList.push(this.getDefaultInvoiceDO());

        return invoiceGroup;
    }

    private getDefaultInvoiceDO(): InvoiceDO {
        var invoice = new InvoiceDO;

        invoice.itemList = [];

        invoice.payerList = [];
        var defaultInvoicePayer = this.getDefaultInvoicePayerFromBooking();
        var invoicePriceCalculator = new InvoicePriceCalculator(invoice, this._loadedDefaultBillingCustomer);
        // defaultInvoicePayer.priceToPay = invoicePriceCalculator.getTotalPrice({
        //     roomCategoryId: this._loadedBooking.roomCategoryId,
        //     configCapacity: this._loadedBooking.configCapacity,
        //     indexedBookingInterval: new IndexedBookingInterval(this._loadedBooking.interval)
        // });
        invoice.payerList.push(defaultInvoicePayer);
        invoice.paymentStatus = InvoicePaymentStatus.Open;

        return invoice;
    }

    private getDefaultInvoicePayerFromBooking(): InvoicePayerDO {
        var invoicePayer = new InvoicePayerDO();

        invoicePayer.customerId = this._loadedBooking.defaultBillingDetails.customerId;
        invoicePayer.paymentMethod = this._loadedBooking.defaultBillingDetails.paymentMethod;

        if (this._loadedDefaultBillingCustomer.isCompanyOrTravelAgency()) {
            var baseCorporateDetails = new BaseCorporateDetailsDO();
            baseCorporateDetails.buildFromObject(this._loadedDefaultBillingCustomer.customerDetails);
            invoicePayer.commissionSnapshot = baseCorporateDetails.commission;
        }

        return invoicePayer;
    }
}