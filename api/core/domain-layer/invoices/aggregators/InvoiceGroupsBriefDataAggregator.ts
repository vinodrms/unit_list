import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoicePayerDO} from '../../../data-layer/invoices/data-objects/payers/InvoicePayerDO';
import {InvoiceGroupBriefDO} from '../../../data-layer/invoices/data-objects/brief/InvoiceGroupBriefDO';
import {InvoiceGroupBriefContainerDO} from '../../../data-layer/invoices/data-objects/brief/InvoiceGroupBriefContainerDO';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceGroupSearchResultRepoDO} from '../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

export class InvoiceGroupsBriefDataAggregator {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getBriefDataByCustomerList(customerIdList: string[]): Promise<InvoiceGroupBriefContainerDO[]> {
        return new Promise<InvoiceGroupBriefContainerDO[]>((resolve: { (result: InvoiceGroupBriefContainerDO[]): void }, reject: { (err: ThError): void }) => {
            this.getBriefDataByCustomerListCore(customerIdList, resolve, reject);
        });
    }

    private getBriefDataByCustomerListCore(customerIdList: string[],
        resolve: { (result: InvoiceGroupBriefContainerDO[]): void }, reject: { (err: ThError): void }) {
        var invoiceGroupBriefContainerList = [];
        var invoiceRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        invoiceRepo.getInvoiceGroupList({ hotelId: this.hotelId }, { customerIdList: customerIdList }).then((result: InvoiceGroupSearchResultRepoDO) => {
            var invoiceGroupList = result.invoiceGroupList;
            _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
                _.forEach(customerIdList, (customerId: string) => {
                    var payerCustomerIdList = _.chain(invoiceGroup.invoiceList).map((invoice: InvoiceDO) => {
                        return invoice.payerList;
                    }).flatten().map((invoicePayer: InvoicePayerDO) => {
                        return invoicePayer.customerId;
                    }).uniq().value();

                    if (_.contains(payerCustomerIdList, customerId)) {
                        var invoiceGroupBriefContainer = _.find(invoiceGroupBriefContainerList, (invoiceGroupBriefContainer: InvoiceGroupBriefContainerDO) => {
                            return customerId === invoiceGroupBriefContainer.customerId;
                        });
                        if (this._thUtils.isUndefinedOrNull(invoiceGroupBriefContainer)) {
                            invoiceGroupBriefContainer = new InvoiceGroupBriefContainerDO()
                            invoiceGroupBriefContainer.invoiceGroupBriefList = [];
                            invoiceGroupBriefContainer.customerId = customerId;
                            invoiceGroupBriefContainerList.push(invoiceGroupBriefContainer);
                        }
                        invoiceGroupBriefContainer.invoiceGroupBriefList.push(this.buildInvoiceGroupBriefFromInvoiceGroupDO(invoiceGroup, customerId));
                    }
                });
            });
            resolve(invoiceGroupBriefContainerList);
        }).catch((error) => {
            var thError = new ThError(ThStatusCode.InvoiceGroupsBriefDataAggregatorErrorGettingInvoiceGroupsBrief, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error getting invoice group brief data", customerIdList, thError);
            reject(thError);
        });
    }

    private buildInvoiceGroupBriefFromInvoiceGroupDO(invoiceGroupDO: InvoiceGroupDO, customerId: string): InvoiceGroupBriefDO {
        var invoiceGroupBrief = new InvoiceGroupBriefDO();
        invoiceGroupBrief.invoiceGroupId = invoiceGroupDO.id;
        invoiceGroupBrief.groupBookingId = invoiceGroupDO.groupBookingId;
        invoiceGroupBrief.price = _.chain(invoiceGroupDO.invoiceList).map((invoice: InvoiceDO) => {
            return invoice.payerList;
        }).flatten().filter((invoicePayer: InvoicePayerDO) => {
            return invoicePayer.customerId === customerId;
        }).map((invoicePayer: InvoicePayerDO) => {
            return invoicePayer.priceToPay;
        }).reduce((totalPriceToPay, individualPrice) => {
            return totalPriceToPay + individualPrice;
        }, 0).value();
        return invoiceGroupBrief;
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}