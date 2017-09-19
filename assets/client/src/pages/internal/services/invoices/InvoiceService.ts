import * as _ from "underscore";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { InvoiceDO, InvoicePaymentStatus } from "./data-objects/InvoiceDO";
import { InvoicesDO } from "./data-objects/InvoicesDO";
import { EagerCustomersService } from "../customers/EagerCustomersService";
import { CustomersDO } from "../customers/data-objects/CustomersDO";
import { InvoiceVM } from "./view-models/InvoiceVM";
import { InvoicePayerDO } from "./data-objects/payer/InvoicePayerDO";
import { InvoiceVMHelper } from "./view-models/utils/InvoiceVMHelper";
import { ThDateIntervalDO } from "../common/data-objects/th-dates/ThDateIntervalDO";
import { ThDateUtils } from "../common/data-objects/th-dates/ThDateUtils";

@Injectable()
export class InvoiceService extends ALazyLoadRequestService<InvoiceVM> {
    
    public static DefaultDayOffset = 3650;

    private _customerIdListFilter: string[];
    private _term: string;
    private _paidInterval: ThDateIntervalDO;
    private _filterByPaidDateInterval: boolean;
    private paymentStatus: InvoicePaymentStatus;

    constructor(appContext: AppContext, private _invoiceVMHelper: InvoiceVMHelper) {
        super(appContext, ThServerApi.InvoicesCount, ThServerApi.Invoices);
        this.buildDefaultSearchInterval();
    }

    private buildDefaultSearchInterval() {
        var dateUtils = new ThDateUtils();
        this._paidInterval = dateUtils.getTodayToTomorrowInterval();
        this._paidInterval.end = dateUtils.addDaysToThDateDO(this._paidInterval.end, InvoiceService.DefaultDayOffset);
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<InvoiceVM[]> {
        var invoices = new InvoicesDO();
        invoices.buildFromObject(pageDataObject);
        return this._invoiceVMHelper.convertToViewModels(invoices);
    }

    public setCustomerIdFilter(customerId: string) {
        this._customerIdListFilter = [customerId];
        this.rebuildDefaultSearchCriteria();
    }
    public searchByText(text: string) {
        this._term = text;
        this.rebuildDefaultSearchCriteria();
        this.refreshData();
    }
    private rebuildDefaultSearchCriteria() {
        this.defaultSearchCriteria = { customerIdList: this._customerIdListFilter, term: this._term, invoicePaymentStatus: this.paymentStatus, paidInterval: this._filterByPaidDateInterval? this.paidInterval: null };
    }

    public get paidInterval(): ThDateIntervalDO {
        return this._paidInterval;
    }
    public set paidInterval(interval: ThDateIntervalDO) {
        this._paidInterval = interval;
        this.rebuildDefaultSearchCriteria();
        this.refreshData();
    }

    public set filterByPaidDateInterval(value: boolean) {
        this._filterByPaidDateInterval = value;
        this.rebuildDefaultSearchCriteria();
        this.refreshData();
    }

    public setPaymentStatus(status: InvoicePaymentStatus) {
        this.paymentStatus = status;
        this.rebuildDefaultSearchCriteria();
    }
}
