import * as _ from "underscore";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { CustomerOperationsPageData } from '../../services/utils/CustomerOperationsPageData';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { HotelAggregatorService } from '../../../../../../../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { Observable } from 'rxjs/Observable';
import { InvoiceDO, InvoicePaymentStatus } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { InvoiceService } from "../../../../../../../../../../../services/invoices/InvoiceService";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";

@Component({
    selector: 'customer-invoice-history',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/components/invoice-history/template/customer-invoice-history.html'
})
export class CustomerInvoiceHistoryComponent implements OnInit {
    @Output() totalInvoiceGroupsCountEmitter = new EventEmitter<number>();
    @Input() customerOperationsPageData: CustomerOperationsPageData;

    isLoading: boolean = false;
    private _pageNumber = 0;
    private _totalCount: number;

    invoiceList: InvoiceDO[] = [];
    ccySymbol: string = "";

    constructor(private context: AppContext,
        private invoiceService: InvoiceService,
        private hotelAggregatorService: HotelAggregatorService,
        private operationsPageControllerService: HotelOperationsPageControllerService) { }

    ngOnInit() {
        this.isLoading = true;
        this.invoiceService.setCustomerIdFilter(this.customerOperationsPageData.customerVM.customer.id);

        this.hotelAggregatorService.getHotelAggregatedInfo().subscribe((aggInfo: HotelAggregatedInfo) => {
            this.ccySymbol = aggInfo.ccy.symbol;
        });
        this.invoiceService.getDataObservable()
            .subscribe((lazyLoadData: LazyLoadData<InvoiceVM>) => {
                this.invoiceList = this.invoiceList.concat(_.map(lazyLoadData.pageContent.pageItemList, (invoiceVM: InvoiceVM) => { return invoiceVM.invoice; }));
                this.totalCount = lazyLoadData.totalCount.numOfItems;
                this.isLoading = false;
            });
        this.invoiceService.refreshData();
    }
    public get canLoadMore() {
        return this.invoiceList.length < this._totalCount;
    }
    public loadMore() {
        if (!this.canLoadMore || this.isLoading) { return; }
        this.isLoading = true;
        this._pageNumber++;
        this.invoiceService.updatePageNumber(this._pageNumber);
    }
    public goToInvoice(invoice: InvoiceDO) {
        this.operationsPageControllerService.goToInvoice(invoice.id);
    }
    public get totalCount(): number {
        return this._totalCount;
    }
    public set totalCount(totalCount: number) {
        this.totalInvoiceGroupsCountEmitter.next(totalCount);
        this._totalCount = totalCount;
    }

    // TODO: switch with InvoiceVM which should contain a meta attribute with the display value
    public getInvoiceStatus(invoice: InvoiceDO): string {
        switch (invoice.paymentStatus) {
            case InvoicePaymentStatus.Credit:
                return "Credit";
            case InvoicePaymentStatus.LossAcceptedByManagement:
                return "Loss Accepted By Management";
            case InvoicePaymentStatus.Unpaid:
                return "Unpaid";
            case InvoicePaymentStatus.Paid:
                return "Paid";
        }
    }
}
