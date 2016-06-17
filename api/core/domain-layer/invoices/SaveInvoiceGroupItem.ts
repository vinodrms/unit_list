import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThUtils} from '../../utils/ThUtils';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {SaveInvoiceGroupItemDO} from './SaveInvoiceGroupItemDO';
import {InvoiceGroupDO} from '../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceGroupItemActionFactory} from '../../domain-layer/invoices/actions/InvoiceGroupItemActionFactory';
import {HotelDO} from '../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO} from '../../data-layer/bookings/data-objects/BookingDO';
import {CustomerIdValidator} from '../../domain-layer/customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../domain-layer/customers/validators/results/CustomersContainer';
import {CustomerDO} from '../../data-layer/customers/data-objects/CustomerDO';
import {InvoicePaymentMethodValidator} from './validators/InvoicePaymentMethodValidator';
import {InvoicePaymentMethodDO} from '../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {PayerDO} from '../../data-layer/invoices/data-objects/payers/PayerDO';
import {AddOnProductIdValidator} from '../../domain-layer/add-on-products/validators/AddOnProductIdValidator';
import {AddOnProductsContainer} from '../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {AddOnProductDO} from '../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {PriceProductIdValidator} from '../../domain-layer/price-products/validators/PriceProductIdValidator';
import {PriceProductsContainer} from '../../domain-layer/price-products/validators/results/PriceProductsContainer';
import {PriceProductDO} from '../../data-layer/price-products/data-objects/PriceProductDO';

export class SaveInvoiceGroupItem {
    private _thUtils: ThUtils;
    private _saveInvoiceGroupDO: SaveInvoiceGroupItemDO;

    private _customersContainer: CustomersContainer;
    private _hotel: HotelDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(saveInvoiceGroupDO: SaveInvoiceGroupItemDO): Promise<InvoiceGroupDO> {
        this._saveInvoiceGroupDO = saveInvoiceGroupDO;
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveRoomItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice gorup", this._saveInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private saveCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveInvoiceGroupItemDO.getValidationStructure().validateStructure(this._saveInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._saveInvoiceGroupDO);
            parser.logAndReject("Error validating data for save invoice group", reject);
            return;
        }

        var invoiceGroupDO = this.getInvoiceGroupDO();

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
                var ppIdValidator = new PriceProductIdValidator(this._appContext, this._sessionContext);
                
                return ppIdValidator.validatePriceProductIdList(invoiceGroupDO.getAggregatedPriceProductIdList());
            }).then((ppContainer: PriceProductsContainer) => {
                
                return Promise.all(_.chain(invoiceGroupDO.getAggregatedPayerList())
                    .map((payer: PayerDO) => {
                        return new InvoicePaymentMethodValidator(this._hotel, this._customersContainer.getCustomerById(payer.customerId)).validate(payer.paymentMethod);
                    }).value());
            }).then((validatedPaymentMethods: InvoicePaymentMethodDO[]) => {

                return this.saveInvoiceGroupItem(invoiceGroupDO);
            }).then((savedInvoiceGroupItem: InvoiceGroupDO) => {
                
                resolve(savedInvoiceGroupItem);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.SaveInvoiceGroupItem, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice group item", this._saveInvoiceGroupDO, thError);
                }
                reject(thError);
            });
    }

    private getInvoiceGroupDO(): InvoiceGroupDO {
        var invoiceGroup = new InvoiceGroupDO();
        invoiceGroup.buildFromObject(this._saveInvoiceGroupDO);
        invoiceGroup.hotelId = this._sessionContext.sessionDO.hotel.id;
        return invoiceGroup;
    }
    private saveInvoiceGroupItem(invoiceGroupDOToBeSaved: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.saveInvoiceGroupItemCore(resolve, reject, invoiceGroupDOToBeSaved);
        });
    }
    private saveInvoiceGroupItemCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }, invoiceGroupDOToBeSaved: InvoiceGroupDO) {
        var actionFactory = new InvoiceGroupItemActionFactory(this._appContext, this._sessionContext);
        var actionStrategy = actionFactory.getActionStrategy(invoiceGroupDOToBeSaved);
        actionStrategy.save(resolve, reject);
    }
}