import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {GenerateBookingInvoiceDO, GenerateBookingInvoiceAopMeta} from './GenerateBookingInvoiceDO';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {BookingIdValidator} from '../validators/BookingIdValidator';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {InvoiceDO, InvoicePaymentStatus} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO, InvoiceItemType} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {InvoicePayerDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {CustomerIdValidator} from '../../customers/validators/CustomerIdValidator';
import {CustomerDO, CustomerType} from '../../../data-layer/customers/data-objects/CustomerDO';
import {CustomersContainer} from '../../customers/validators/results/CustomersContainer';
import {GenerateBookingInvoiceActionFactory} from './actions/GenerateBookingInvoiceActionFactory';
import {IGenerateBookingInvoiceActionStrategy} from './actions/IGenerateBookingInvoiceActionStrategy';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

import _ = require('underscore');

export class GenerateBookingInvoice {
    private _thUtils: ThUtils;
    private _generateBookingInvoiceDO: GenerateBookingInvoiceDO;

    private _loadedBooking: BookingDO;
    private _loadedDefaultBillingCustomer: CustomerDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public generate(generateBookingInvoiceItemDO: GenerateBookingInvoiceDO): Promise<InvoiceGroupDO> {
        this._generateBookingInvoiceDO = generateBookingInvoiceItemDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.generateCore(resolve, reject);
        });
    }

    private generateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {

        var bookingIdValidator = new BookingIdValidator(this._appContext, this._sessionContext);
        bookingIdValidator.validateBookingId(this._generateBookingInvoiceDO.groupBookingId, this._generateBookingInvoiceDO.bookingId).then((booking: BookingDO) => {
            this._loadedBooking = booking;

            var customerIdValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            return customerIdValidator.validateCustomerIdList([this._loadedBooking.defaultBillingDetails.customerId]);
        }).then((loadedCustomersContainer: CustomersContainer) => {
            this._loadedDefaultBillingCustomer = loadedCustomersContainer.customerList[0];

            return this.getDefaultInvoiceDO();
        }).then((defaultInvoice: InvoiceDO) => {
            var generateBookingInvoiceActionFactory = new GenerateBookingInvoiceActionFactory(this._appContext, this._sessionContext);
            return generateBookingInvoiceActionFactory.getActionStrategy(this._loadedBooking.groupBookingId, defaultInvoice);
        }).then((actionStrategy: IGenerateBookingInvoiceActionStrategy) => {
            actionStrategy.generateBookingInvoice(resolve, reject);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.GenerateBookingInvoiceError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error generating invoice related to booking", this._generateBookingInvoiceDO, thError);
            reject(thError);
        });
    }

    private getDefaultInvoiceDO(): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.getDefaultInvoiceDOCore(resolve, reject);
        });
    }

    private getDefaultInvoiceDOCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var invoice = new InvoiceDO();
        invoice.bookingId = this._loadedBooking.bookingId;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        bookingInvoiceItem.id = this._loadedBooking.bookingId;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;

        if (!this._thUtils.isUndefinedOrNull(this._generateBookingInvoiceDO.initialAddOnProducts)
            && _.isArray(this._generateBookingInvoiceDO.initialAddOnProducts)) {
            _.forEach(this._generateBookingInvoiceDO.initialAddOnProducts, (aop: GenerateBookingInvoiceAopMeta) => {
                var invoiceItem = new InvoiceItemDO();
                invoiceItem.buildFromAddOnProductDO(aop.addOnProductDO, aop.noOfItems);
                invoiceItem.id = aop.addOnProductDO.id;
                invoice.itemList.push(invoiceItem);
            });
        }

        this._appContext.getRepositoryFactory().getBookingRepository().getBookingById({ hotelId: this.hotelId }, this._generateBookingInvoiceDO.groupBookingId,
            this._generateBookingInvoiceDO.bookingId).then((booking: BookingDO) => {
                invoice.payerList = [];
                var defaultInvoicePayer =
                    InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(this._loadedDefaultBillingCustomer, this._loadedBooking.defaultBillingDetails.paymentMethod);
                defaultInvoicePayer.priceToPay = booking.price.getPrice() * booking.price.getNumberOfItems();
                invoice.payerList.push(defaultInvoicePayer);

                resolve(invoice);
            });
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}