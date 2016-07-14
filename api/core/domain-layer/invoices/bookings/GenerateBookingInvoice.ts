import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {GenerateBookingInvoiceDO} from './GenerateBookingInvoiceDO';
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
import {GenerateBookingInvoiceActionFactory} from './actions/GenerateBookingInvoiceActionFactory';
import {IGenerateBookingInvoiceActionStrategy} from './actions/IGenerateBookingInvoiceActionStrategy';

export class GenerateBookingInvoice { 
    private _thUtils: ThUtils;
    private _generateBookingInvoiceDO: GenerateBookingInvoiceDO;

    private _loadedBooking: BookingDO;
    private _loadedDefaultBillingCustomer: CustomerDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public generate(addNewBookingInvoiceItemDO: GenerateBookingInvoiceDO): Promise<InvoiceGroupDO> {
        this._generateBookingInvoiceDO = addNewBookingInvoiceItemDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.generateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddNewBookingInvoiceGroupError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding new booking related invoice gorup", this._generateBookingInvoiceDO, thError);
                reject(thError);
            }
        });
    }

    private generateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = GenerateBookingInvoiceDO.getValidationStructure().validateStructure(this._generateBookingInvoiceDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._generateBookingInvoiceDO);
            parser.logAndReject("Error validating data for adding new booking related invoice group", reject);
            return;
        }

        var bookingIdValidator = new BookingIdValidator(this._appContext, this._sessionContext);
        bookingIdValidator.validateBookingId(this._generateBookingInvoiceDO.groupBookingId, this._generateBookingInvoiceDO.bookingId).then((booking: BookingDO) => {
            this._loadedBooking = booking;

            var customerIdValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerIdValidator.validateCustomerIdList([this._loadedBooking.defaultBillingDetails.customerId]);
        }).then((loadedCustomersContainer: CustomersContainer) => {
            this._loadedDefaultBillingCustomer = loadedCustomersContainer.customerList[0];

            var generateBookingInvoiceActionFactory = new GenerateBookingInvoiceActionFactory(this._appContext, this._sessionContext);
            return generateBookingInvoiceActionFactory.getActionStrategy(this._loadedBooking.groupBookingId, this.getDefaultInvoiceDO());
        }).then((actionStrategy: IGenerateBookingInvoiceActionStrategy) => {
            actionStrategy.generateBookingInvoice(resolve, reject);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.GenerateBookingInvoiceError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding invoice related to booking", this._generateBookingInvoiceDO, thError);
            }
            reject(thError);
        });
    }

    private getDefaultInvoiceDO(): InvoiceDO {
        var invoice = new InvoiceDO;
        invoice.bookingId = this._loadedBooking.bookingId;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.payerList = [];
        var defaultInvoicePayer = 
            InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(this._loadedDefaultBillingCustomer, this._loadedBooking.defaultBillingDetails.paymentMethod);
        invoice.payerList.push(defaultInvoicePayer);
        invoice.paymentStatus = InvoicePaymentStatus.Open;
        return invoice;
    }

}