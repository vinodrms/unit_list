import {BaseDO} from '../../common/base/BaseDO';
import {InvoiceDO, InvoicePaymentStatus} from './InvoiceDO';
import {InvoiceItemDO} from './items/InvoiceItemDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {IBookingRepository} from '../../bookings/repositories/IBookingRepository';
import {ThUtils} from '../../../utils/ThUtils';

export enum InvoiceGroupStatus {
    Active,
    Deleted
}

export class InvoiceGroupDO extends BaseDO {
    id: string;
    versionId: number;
    hotelId: string;
    groupBookingId: string;
    indexedCustomerIdList: string[];
    invoiceList: InvoiceDO[];
    paymentStatus: InvoicePaymentStatus;
    status: InvoiceGroupStatus;

    constructor(public bookingRepo?: IBookingRepository) {
        super();

        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(bookingRepo)) {
            delete this.bookingRepo;
        }
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "groupBookingId", "indexedCustomerIdList", "paymentStatus", "status"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.invoiceList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "invoiceList"), (invoiceObject: Object) => {
            var invoiceDO = new InvoiceDO({
                bookingRepo: this.bookingRepo,
                hotelId: this.hotelId,
                groupBookingId: this.groupBookingId
            });
            invoiceDO.buildFromObject(invoiceObject);
            this.invoiceList.push(invoiceDO);
        });
    }

    public getAggregatedCustomerIdList(): string[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.getPayerCustomerIdList());
        }, []);
    }

    public getAggregatedAddOnProductIdList(): string[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.getAddOnProductIdList());
        }, []);
    }

    public getAggregatedPayerList(): InvoicePayerDO[] {
        return _.reduce(this.invoiceList, (result, invoice: InvoiceDO) => {
            return _.union(result, invoice.payerList);
        }, []);
    }

    public getCleanInvoiceGroupDOForDBSave(): InvoiceGroupDO {
        delete this.bookingRepo;
        var cleanInvoiceList = [];
        _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
            delete invoice.bookingInvoiceMeta;
            var cleanInvoiceItemList = [];
            _.forEach(invoice.itemList, (invoiceItem: InvoiceItemDO) => {
                delete invoiceItem.bookingInvoiceItemMeta;
                cleanInvoiceItemList.push(invoiceItem);
            });
            invoice.itemList = cleanInvoiceItemList;
            cleanInvoiceList.push(invoice);
        });
        this.invoiceList = cleanInvoiceList;
        return this;
    }

    public reindexByCustomerId() {
        this.indexedCustomerIdList = _.chain(this.invoiceList).map((invoice: InvoiceDO) => {
            return invoice.payerList;
        })
            .flatten()
            .map((invoicePayer: InvoicePayerDO) => {
                return invoicePayer.customerId;
            })
            .uniq()
            .value();
    }

    public removeMetaObjectAttributeIfNull() {
        var thUtils = new ThUtils();

        _.forEach(this.invoiceList, (invoice: InvoiceDO) => {
            _.forEach(invoice.itemList, (invoiceItem: InvoiceItemDO) => {
                if (thUtils.isUndefinedOrNull(invoiceItem._metaObject))
                    delete invoiceItem._metaObject;
            })
        })
    }
}