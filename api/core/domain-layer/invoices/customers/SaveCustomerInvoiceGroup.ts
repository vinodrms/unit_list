import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {SaveCustomerInvoiceGroupDO} from './SaveCustomerInvoiceGroupDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {CustomerIdValidator} from '../../../domain-layer/customers/validators/CustomerIdValidator';
import {CustomersContainer} from '../../../domain-layer/customers/validators/results/CustomersContainer';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO} from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository'
import {InvoicePaymentMethodValidator} from '../validators/InvoicePaymentMethodValidator';
import {InvoicePaymentMethodDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {InvoicePayerDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {AddOnProductIdValidator} from '../../../domain-layer/add-on-products/validators/AddOnProductIdValidator';
import {AddOnProductsContainer} from '../../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

export class SaveCustomerInvoiceGroup {
    private _thUtils: ThUtils;
    private _updateInvoiceGroupDO: SaveCustomerInvoiceGroupDO;

    private _hotel: HotelDO;
    private _customersContainer: CustomersContainer;
    private _invoicePaymentMethodList: InvoicePaymentMethodDO[];

    private _loadedInvoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public update(updateInvoiceGroupDO: SaveCustomerInvoiceGroupDO): Promise<InvoiceGroupDO> {
        this._updateInvoiceGroupDO = updateInvoiceGroupDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.updateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.UpdateInvoiceGroupItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving invoice gorup", this._updateInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private updateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveCustomerInvoiceGroupDO.getValidationStructure().validateStructure(this._updateInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._updateInvoiceGroupDO);
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

                return invoiceGroupRepo.getInvoiceGroupById({ hotelId: this.hotelId }, invoiceGroupDO.id);
            }).then((loadedInvoiceGroup: InvoiceGroupDO) => {
                this._loadedInvoiceGroup = loadedInvoiceGroup;

                return invoiceGroupRepo.updateInvoiceGroup(this.buildInvoiceGroupMeta(), this.buildInvoiceGroupItemMeta(), this._loadedInvoiceGroup);
            }).then((updatedInvoiceGroup: InvoiceGroupDO) => {
                resolve(updatedInvoiceGroup);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.SaveInvoiceGroupItem, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error updating invoice group item", this._updateInvoiceGroupDO, thError);
                }
                reject(thError);
            });
    }

    private getInvoiceGroupDO(): InvoiceGroupDO {
        var invoiceGroup = new InvoiceGroupDO();
        invoiceGroup.buildFromObject(this._updateInvoiceGroupDO);
        return invoiceGroup;
    }
    private buildInvoiceGroupMeta(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this.hotelId
        };
    }
    private buildInvoiceGroupItemMeta(): InvoiceGroupItemMetaRepoDO {
        return {
            id: this._loadedInvoiceGroup.id,
            versionId: this._loadedInvoiceGroup.versionId
        };
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}