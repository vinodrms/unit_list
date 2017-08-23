import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThUtils } from '../../../utils/ThUtils';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ValidationResultParser } from '../../common/ValidationResultParser';
import { GenerateBookingInvoiceDO, GenerateBookingInvoiceAopMeta } from './GenerateBookingInvoiceDO';
import { InvoiceGroupDO } from '../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import { BookingDO, AddOnProductBookingReservedItem } from '../../../data-layer/bookings/data-objects/BookingDO';
import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from '../../../data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../data-layer/invoices-deprecated/data-objects/items/InvoiceItemDO';
import { InvoicePayerDO } from '../../../data-layer/invoices-deprecated/data-objects/payers/InvoicePayerDO';
import { InvoicePaymentMethodType } from '../../../data-layer/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO';
import { CustomerIdValidator } from '../../customers/validators/CustomerIdValidator';
import { CustomerDO, CustomerType } from '../../../data-layer/customers/data-objects/CustomerDO';
import { CustomersContainer } from '../../customers/validators/results/CustomersContainer';
import { AddOnProductLoader, AddOnProductItemContainer, AddOnProductItem } from "../../add-on-products/validators/AddOnProductLoader";
import { GenerateBookingInvoiceActionFactory } from './actions/GenerateBookingInvoiceActionFactory';
import { IGenerateBookingInvoiceActionStrategy } from './actions/IGenerateBookingInvoiceActionStrategy';
import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { BaseCorporateDetailsDO } from '../../../data-layer/customers/data-objects/customer-details/corporate/BaseCorporateDetailsDO';
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { PaymentMethodInstanceDO } from "../../../data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { TransactionFeeDO } from "../../../data-layer/common/data-objects/payment-method/TransactionFeeDO";

import _ = require('underscore');

export class GenerateBookingInvoice {
    private _thUtils: ThUtils;
    private _generateBookingInvoiceDO: GenerateBookingInvoiceDO;

    private _loadedBooking: BookingDO;
    private _loadedDefaultBillingCustomer: CustomerDO;
    private _reservedAopMetaList: GenerateBookingInvoiceAopMeta[];

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
        var validationResult = GenerateBookingInvoiceDO.getValidationStructure().validateStructure(this._generateBookingInvoiceDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._generateBookingInvoiceDO);
            parser.logAndReject("Error validating data for Generate Booking Invoice", reject);
            return;
        }

        var bookignRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookignRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._generateBookingInvoiceDO.groupBookingId, this._generateBookingInvoiceDO.id)
            .then((booking: BookingDO) => {
                this._loadedBooking = booking;

                return this.getReservedAopMetaList();
            }).then((reservedAopMetaList: GenerateBookingInvoiceAopMeta[]) => {
                this._reservedAopMetaList = reservedAopMetaList;

                var customerIdValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                return customerIdValidator.validateCustomerIdList([this._loadedBooking.defaultBillingDetails.customerId]);
            }).then((loadedCustomersContainer: CustomersContainer) => {
                this._loadedDefaultBillingCustomer = loadedCustomersContainer.customerList[0];

                return this.getDefaultInvoiceDO();
            }).then((defaultInvoice: InvoiceDO) => {
                var generateBookingInvoiceActionFactory = new GenerateBookingInvoiceActionFactory(this._appContext, this._sessionContext);
                return generateBookingInvoiceActionFactory.getActionStrategy(this._loadedBooking, defaultInvoice);
            }).then((actionStrategy: IGenerateBookingInvoiceActionStrategy) => {
                actionStrategy.generateBookingInvoice(resolve, reject);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.GenerateBookingInvoiceError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error generating invoice related to booking", this._generateBookingInvoiceDO, thError);
                reject(thError);
            });
    }

    private getReservedAopMetaList(): Promise<GenerateBookingInvoiceAopMeta[]> {
        return new Promise<GenerateBookingInvoiceAopMeta[]>((resolve: { (result: GenerateBookingInvoiceAopMeta[]): void }, reject: { (err: ThError): void }) => {
            this.getReservedAopMetaListCore(resolve, reject);
        });
    }
    private getReservedAopMetaListCore(resolve: { (result: GenerateBookingInvoiceAopMeta[]): void }, reject: { (err: ThError): void }) {
        if (this._loadedBooking.price.isPenalty()) {
            resolve([]);
            return;
        }
        var addOnProductLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
        addOnProductLoader.load(this._loadedBooking.reservedAddOnProductIdList)
            .then((addOnProductItemContainer: AddOnProductItemContainer) => {
                let initialAddOnProducts = this.getGenerateBookingInvoiceAop(this._loadedBooking.reservedAddOnProductList, addOnProductItemContainer);
                resolve(initialAddOnProducts);
            }).catch((error: ThError) => {
                reject(error);
            });
    }
    private getGenerateBookingInvoiceAop(addOnProductList: AddOnProductBookingReservedItem[], addOnProductsContainer: AddOnProductItemContainer): GenerateBookingInvoiceAopMeta[] {
        var initialAddOnProducts: GenerateBookingInvoiceAopMeta[] = [];
        if (this._thUtils.isUndefinedOrNull(addOnProductList) || !_.isArray(addOnProductList)) {
            return initialAddOnProducts;
        }
        var reservedAopMap: { [id: string]: AddOnProductBookingReservedItem } = _.indexBy(addOnProductList, reservedAop => {return reservedAop.aopId});
        var aopIdList: string[] = Object.keys(reservedAopMap);
        _.forEach(aopIdList, (aopId: string) => {
            var addOnProductItem: AddOnProductItem = addOnProductsContainer.getAddOnProductItemById(aopId);
            if (!this._thUtils.isUndefinedOrNull(addOnProductItem)) {
                var noOfItems = reservedAopMap[aopId].noOfItems;
                initialAddOnProducts.push({
                    addOnProductDO: addOnProductItem.addOnProduct,
                    noOfItems: noOfItems
                });
            }
        });
        return initialAddOnProducts;
    }

    private getDefaultInvoiceDO(): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.getDefaultInvoiceDOCore(resolve, reject);
        });
    }

    private getDefaultInvoiceDOCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        var invoice = new InvoiceDO();
        invoice.bookingId = this._loadedBooking.id;
        invoice.accountingType = InvoiceAccountingType.Debit;
        invoice.itemList = [];
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        bookingInvoiceItem.id = this._loadedBooking.id;
        invoice.itemList.push(bookingInvoiceItem);
        invoice.paymentStatus = InvoicePaymentStatus.Unpaid;


        invoice.payerList = [];
        var defaultInvoicePayer =
            InvoicePayerDO.buildFromCustomerDOAndPaymentMethod(this._loadedDefaultBillingCustomer, this._loadedBooking.defaultBillingDetails.paymentMethod);

        defaultInvoicePayer.priceToPay = this._thUtils.roundNumberToTwoDecimals(this._loadedBooking.price.totalBookingPrice);

        if (defaultInvoicePayer.paymentMethod.type === InvoicePaymentMethodType.PayInvoiceByAgreement) {
            var corporateDetails = new BaseCorporateDetailsDO();
            corporateDetails.buildFromObject(this._loadedDefaultBillingCustomer.customerDetails);

            defaultInvoicePayer.priceToPay =
                this._thUtils.roundNumberToTwoDecimals(defaultInvoicePayer.priceToPay + corporateDetails.invoiceFee);
        }

        invoice.payerList.push(defaultInvoicePayer);

        _.forEach(this._reservedAopMetaList, (generateAopMeta: GenerateBookingInvoiceAopMeta) => {
            var aopInvoiceItem = new InvoiceItemDO();
            aopInvoiceItem.buildFromAddOnProductDO(generateAopMeta.addOnProductDO, generateAopMeta.noOfItems, generateAopMeta.addOnProductDO.getVatId());
            invoice.itemList.push(aopInvoiceItem);
        });

        invoice.notesFromBooking = this._loadedBooking.invoiceNotes;

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this.hotelId).then((hotel: HotelDO) => {
            let transactionFee: TransactionFeeDO = null;

            if (invoice.payerList[0].paymentMethod.type != InvoicePaymentMethodType.PayInvoiceByAgreement) {
                transactionFee = _.find(hotel.paymentMethodList, (paymentMethodInstance: PaymentMethodInstanceDO) => {
                    return paymentMethodInstance.paymentMethodId === invoice.payerList[0].paymentMethod.value;
                }).transactionFee;
            }
            else {
                transactionFee = TransactionFeeDO.getDefaultTransactionFee();
            }

            invoice.payerList[0].transactionFeeSnapshot = transactionFee;
            invoice.payerList[0].priceToPayPlusTransactionFee = transactionFee.getAmountWihtTransactionFeeIncluded(invoice.payerList[0].priceToPay);

            resolve(invoice);
        }).catch(e => {
            reject(e);
        })
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}
