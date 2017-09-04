import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { InvoiceGroupsServiceDeprecated } from '../../../../../../../../../../../services/invoices-deprecated/InvoiceGroupsService';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { CustomerOperationsPageData } from '../../services/utils/CustomerOperationsPageData';
import { LazyLoadData } from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import { InvoiceGroupPayerStatsDO } from '../../../../../../../../../../../services/invoices-deprecated/data-objects/stats/InvoiceGroupPayerStatsDO';
import { InvoiceGroupDO } from '../../../../../../../../../../../services/invoices-deprecated/data-objects/InvoiceGroupDO';
import { HotelAggregatorService } from '../../../../../../../../../../../services/hotel/HotelAggregatorService';
import { HotelAggregatedInfo } from '../../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { Observable } from 'rxjs/Observable';

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

    invoiceGroupPayerStatsList: InvoiceGroupPayerStatsDO[] = [];
    ccySymbol: string = "";

    constructor(private _appContext: AppContext,
        private _invoiceGroupsServiceDeprecated: InvoiceGroupsServiceDeprecated,
        private _hotelAggregatorService: HotelAggregatorService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) { }

    ngOnInit() {
        this.isLoading = true;
        this._invoiceGroupsServiceDeprecated.setCustomerIdFilter(this.customerOperationsPageData.customerVM.customer.id);

        this._hotelAggregatorService.getHotelAggregatedInfo().subscribe((aggInfo: HotelAggregatedInfo) => {
            this.ccySymbol = aggInfo.ccy.symbol;
        });
        this._invoiceGroupsServiceDeprecated.getDataObservable().subscribe((lazyLoadData: LazyLoadData<InvoiceGroupDO>) => {
            var invoiceGroupPayerStatsList = InvoiceGroupPayerStatsDO.buildInvoiceGroupPayerStatsListFromInvoiceGroupList(lazyLoadData.pageContent.pageItemList,
                this.customerOperationsPageData.customerVM.customer.id);
            this.invoiceGroupPayerStatsList = this.invoiceGroupPayerStatsList.concat(invoiceGroupPayerStatsList);
            this.totalCount = lazyLoadData.totalCount.numOfItems;
            this.isLoading = false;
        });
        this._invoiceGroupsServiceDeprecated.refreshData();
    }
    public get canLoadMore() {
        return this.invoiceGroupPayerStatsList.length < this._totalCount;
    }
    public loadMore() {
        if (!this.canLoadMore || this.isLoading) { return; }
        this.isLoading = true;
        this._pageNumber++;
        this._invoiceGroupsServiceDeprecated.updatePageNumber(this._pageNumber);
    }
    public goToInvoice(invoiceGroupPayerStatsDO: InvoiceGroupPayerStatsDO) {
        this._operationsPageControllerService.goToInvoice(invoiceGroupPayerStatsDO.invoiceGroupId, {}, false);
    }
    public get totalCount(): number {
        return this._totalCount;
    }
    public set totalCount(totalCount: number) {
        this.totalInvoiceGroupsCountEmitter.next(totalCount);
        this._totalCount = totalCount;
    }
}
