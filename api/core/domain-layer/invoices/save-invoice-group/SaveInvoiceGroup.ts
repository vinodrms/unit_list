import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';

import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {SaveInvoiceGroupDO} from './SaveInvoiceGroupDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {CustomerIdValidator} from '../../../domain-layer/customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../domain-layer/customers/validators/results/CustomersContainer';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO} from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository'
import {InvoicePaymentMethodValidator} from '../validators/InvoicePaymentMethodValidator';
import {InvoicePaymentMethodDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {InvoicePayerDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoiceItemDO} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {AddOnProductIdValidator} from '../../../domain-layer/add-on-products/validators/AddOnProductIdValidator';
import {AddOnProductsContainer} from '../../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

import {SaveInvoiceGroupActionFactory} from './actions/SaveInvoiceGroupActionFactory';

export class SaveInvoiceGroup {
    private _thUtils: ThUtils;
    private _saveInvoiceGroup: SaveInvoiceGroupDO;

    private _hotel: HotelDO;
    private _customersContainer: CustomersContainer;
    private _invoicePaymentMethodList: InvoicePaymentMethodDO[];

    private _loadedInvoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(saveInvoiceItemDO: SaveInvoiceGroupDO): Promise<InvoiceGroupDO> {
        this._saveInvoiceGroup = saveInvoiceItemDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.saveCore(resolve, reject);
        });
    }

    private saveCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveInvoiceGroupDO.getValidationStructure().validateStructure(this._saveInvoiceGroup);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._saveInvoiceGroup);
            parser.logAndReject("Error validating data for updating invoice group", reject);
            return;
        }

        var invoiceGroupDO = this.getInvoiceGroupDO();
        var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._hotel = loadedHotel;

                var customerIdValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                return customerIdValidator.validateCustomerIdList(invoiceGroupDO.getAggregatedCustomerIdList());
            }).then((customersContainer: CustomersContainer) => {
                this._customersContainer = customersContainer;

                var aopIdValidator = new AddOnProductIdValidator(this._appContext, this._sessionContext);
                return aopIdValidator.validateAddOnProductIdList(invoiceGroupDO.getAggregatedAddOnProductIdList());
            }).then((aopContainer: AddOnProductsContainer) => {
                return Promise.all(_.chain(invoiceGroupDO.getAggregatedPayerList())
                    .map((payer: InvoicePayerDO) => {
                        return new InvoicePaymentMethodValidator(this._hotel, this._customersContainer.getCustomerById(payer.customerId)).validate(payer.paymentMethod);
                    }).value());
            }).then((validatedPaymentMethods: InvoicePaymentMethodDO[]) => {
                this._invoicePaymentMethodList = validatedPaymentMethods;

                var actionFactory = new SaveInvoiceGroupActionFactory(this._appContext, this._sessionContext);
                var actionStrategy = actionFactory.getActionStrategy(invoiceGroupDO);
                actionStrategy.saveInvoiceGroup(resolve, reject);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.SaveInvoiceGroupError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice group", this._saveInvoiceGroup, thError);
                reject(thError);
            });
    }

    private getInvoiceGroupDO(): InvoiceGroupDO {
        var invoiceGroup = new InvoiceGroupDO();
        invoiceGroup.buildFromObject(this._saveInvoiceGroup);
        if (invoiceGroup.id == null) {
            delete invoiceGroup.id;
        }
        if (invoiceGroup.groupBookingId == null) {
            delete invoiceGroup.groupBookingId;
        }
        _.forEach(invoiceGroup.invoiceList, (invoice: InvoiceDO) => {
            if (invoice.bookingId == null) {
                delete invoice.bookingId;
            }
            if (invoice.paidDate == null) {
                delete invoice.paidDate;
            }
        });
        return invoiceGroup;
    }
}