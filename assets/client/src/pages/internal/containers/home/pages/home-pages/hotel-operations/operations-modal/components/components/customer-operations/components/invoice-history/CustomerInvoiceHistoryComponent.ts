import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {InvoiceGroupsService} from '../../../../../../../../../../../services/invoices/InvoiceGroupsService';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {CustomerOperationsPageData} from '../../services/utils/CustomerOperationsPageData';
import {LazyLoadData} from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import {InvoiceGroupPayerStatsDO} from '../../../../../../../../../../../services/invoices/data-objects/stats/InvoiceGroupPayerStatsDO';
import {HotelAggregatorService} from '../../../../../../../../../../../services/hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

@Component({
    selector: 'customer-invoice-history',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/components/invoice-history/template/customer-invoice-history.html',
    providers: [InvoiceGroupsService, HotelAggregatorService],
    pipes: [TranslationPipe]
})
export class CustomerInvoiceHistoryComponent implements OnInit {
    @Output() totalInvoiceGroupsCountEmitter = new EventEmitter<number>();
    @Input() customerOperationsPageData: CustomerOperationsPageData;

    isLoading: boolean = false;
    private _pageNumber = 0;
    private _totalCount: number;

    invoiceGroupPayerStatsList: InvoiceGroupPayerStatsDO[] = [];
    ccySymbol: string;

    constructor(private _appContext: AppContext,
        private _invoiceGroupsService: InvoiceGroupsService,
        private _hotelAggregatorService: HotelAggregatorService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) { }

    ngOnInit() {
        this.isLoading = true;
        this._invoiceGroupsService.setCustomerIdFilter(this.customerOperationsPageData.customerVM.customer.id);

        Observable.combineLatest(
            this._invoiceGroupsService.getDataObservable(),
            this._hotelAggregatorService.getHotelAggregatedInfo()
        ).subscribe((result: [LazyLoadData<InvoiceGroupPayerStatsDO>, HotelAggregatedInfo]) => {
            this.invoiceGroupPayerStatsList = this.invoiceGroupPayerStatsList.concat(result[0].pageContent.pageItemList);
            this.totalCount = result[0].totalCount.numOfItems;
            this.ccySymbol = result[1].ccy.symbol;
            this.isLoading = false;
        });
        
        this._hotelAggregatorService.refresh();
        this._invoiceGroupsService.refreshData();
    }
    public get canLoadMore() {
        return this.invoiceGroupPayerStatsList.length < this._totalCount;
    }
    public loadMore() {
        if (!this.canLoadMore || this.isLoading) { return; }
        this.isLoading = true;
        this._pageNumber++;
        this._invoiceGroupsService.updatePageNumber(this._pageNumber);
    }
    public goToInvoice(invoiceGroupPayerStatsDO: InvoiceGroupPayerStatsDO) {
        this._operationsPageControllerService.goToInvoice(invoiceGroupPayerStatsDO.invoiceGroupId, {});
    }
    public get totalCount(): number {
        return this._totalCount;
    }
    public set totalCount(totalCount: number) {
        this.totalInvoiceGroupsCountEmitter.next(totalCount);
        this._totalCount = totalCount;
    }
}