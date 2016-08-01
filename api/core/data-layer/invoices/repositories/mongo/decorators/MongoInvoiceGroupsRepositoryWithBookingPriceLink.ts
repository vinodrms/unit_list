import {ThUtils} from '../../../../../../core/utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoInvoiceGroupsRepositoryDecorator} from './MongoInvoiceGroupsRepositoryDecorator';
import {MongoInvoiceGroupsRepository} from '../MongoInvoiceGroupsRepository';
import {IBookingRepository, BookingSearchResultRepoDO, BookingMetaRepoDO, BookingSearchCriteriaRepoDO} from '../../../../bookings/repositories/IBookingRepository';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO} from '../../IInvoiceGroupsRepository'
import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';

export class MongoInvoiceGroupsRepositoryWithBookingPriceLink extends MongoInvoiceGroupsRepositoryDecorator {

    constructor(invoiceGroupsRepo: MongoInvoiceGroupsRepository, private _bookingsRepo: IBookingRepository) {
        super(invoiceGroupsRepo);
    }

    public getInvoiceGroupById(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGoupsRepo.getInvoiceGroupById(invoiceGroupMeta, invoiceGroupId).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                });
            });
        });
    }
    public getInvoiceGroupList(invoiceGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return new Promise<InvoiceGroupSearchResultRepoDO>((resolve: { (result: InvoiceGroupSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGoupsRepo.getInvoiceGroupList(invoiceGroupMeta, searchCriteria, lazyLoad).then((result: InvoiceGroupSearchResultRepoDO) => {
                this.linkBookingPricesToInvoiceGroupSearchResultRepoDO(invoiceGroupMeta, result).then((result: InvoiceGroupSearchResultRepoDO) => {
                    resolve(result);
                });
            });
        });
    }
    public addInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            
            this._invoiceGoupsRepo.addInvoiceGroup(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                });
            });
        });
    }
    public updateInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            
            this._invoiceGoupsRepo.updateInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                });
            });
        });
    }
    public deleteInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this._invoiceGoupsRepo.deleteInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta).then((invoiceGroup: InvoiceGroupDO) => {
                this.linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta, invoiceGroup).then((invoiceGroup: InvoiceGroupDO) => {
                    resolve(invoiceGroup);
                });
            });
        });
    }

    private linkBookingPricesToInvoiceGroupItem(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupList(invoiceGroupMeta, [invoiceGroup]).then((invoiceGroupList: InvoiceGroupDO[]) => {
                resolve(invoiceGroupList[0]);
            });
        });
    }

    private linkBookingPricesToInvoiceGroupSearchResultRepoDO(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupSearchResult: InvoiceGroupSearchResultRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return new Promise<InvoiceGroupSearchResultRepoDO>((resolve: { (result: InvoiceGroupSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupList(invoiceGroupMeta, invoiceGroupSearchResult.invoiceGroupList).then((invoiceGroupList: InvoiceGroupDO[]) => {
                invoiceGroupSearchResult.invoiceGroupList = invoiceGroupList;
                resolve(invoiceGroupSearchResult);
            });
        });
    }

    private linkBookingPricesToInvoiceGroupList(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]): Promise<InvoiceGroupDO[]> {
        return new Promise<InvoiceGroupDO[]>((resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }) => {
            this.linkBookingPricesToInvoiceGroupListCore(resolve, reject, invoiceGroupMeta, invoiceGroupList);
        });
    }

    private linkBookingPricesToInvoiceGroupListCore(resolve: { (result: InvoiceGroupDO[]): void }, reject: { (err: ThError): void }, invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupList: InvoiceGroupDO[]) {
        this._bookingsRepo.getBookingList(this.buildBookingMetaFromInvoiceGroupMeta(invoiceGroupMeta), this.buildBookingListSearchCriteria(invoiceGroupList)).then((result: BookingSearchResultRepoDO) => {
            var bookingList = result.bookingList;
            
            _.forEach(invoiceGroupList, (invoiceGroup: InvoiceGroupDO) => {
                invoiceGroup.linkBookingPrices(bookingList);
            });

            resolve(invoiceGroupList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.InvoiceGroupsRepositoryBookingPriceLinkError, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error linking the booking prices with the invoice groups", context, thError);
            reject(thError);
        });
    }

    private buildBookingMetaFromInvoiceGroupMeta(invoidGroupMeta: InvoiceGroupMetaRepoDO): BookingMetaRepoDO {
        return {
            hotelId: invoidGroupMeta.hotelId
        }
    }

    private buildBookingListSearchCriteria(invoiceGroupList: InvoiceGroupDO[]): BookingSearchCriteriaRepoDO {
        var thUtils = new ThUtils();

        return {
            groupBookingIdList: _.chain(invoiceGroupList).map((invoiceGroup: InvoiceGroupDO) => {
                return invoiceGroup.groupBookingId;
            }).filter((groupBookingId: string) => {
                return !thUtils.isUndefinedOrNull(groupBookingId);
            }).value()
        };
    }
}