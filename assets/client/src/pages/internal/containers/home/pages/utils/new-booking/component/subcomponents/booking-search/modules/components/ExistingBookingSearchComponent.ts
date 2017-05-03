import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { LazyLoadingTableComponent } from '../../../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta } from '../../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { AppContext, ThError } from '../../../../../../../../../../../../common/utils/AppContext';
import { BookingCartItemVM, BookingCartItemVMType } from '../../../../../services/search/view-models/BookingCartItemVM';
import { BookingSearchService } from '../../../../../services/search/BookingSearchService';
import { ExistingBookingSearchInput } from './utils/ExistingBookingSearchInput';
import { BookingSearchResultsTableMetaBuilderService } from '../../../utils/table-builder/BookingSearchResultsTableMetaBuilderService';
import { BookingSearchParams } from '../../../../../services/data-objects/BookingSearchParams';
import { CustomersDO } from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { CustomerDO } from '../../../../../../../../../../services/customers/data-objects/CustomerDO';
import { RoomCategoryDO } from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';

@Component({
    selector: 'existing-booking-search',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/modules/components/template/existing-booking-search.html',
    providers: [BookingSearchService, BookingSearchResultsTableMetaBuilderService]
})
export class ExistingBookingSearchComponent implements OnInit {
    @ViewChild('searchResults') private _searchResultsTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

    @Input() searchInput: ExistingBookingSearchInput;

    @Output() onBookingCartItemVMSelected = new EventEmitter<BookingCartItemVM>();
    public triggerOnBookingCartItemVMSelected(bookingCartItem: BookingCartItemVM) {
        this.onBookingCartItemVMSelected.next(bookingCartItem);
    }

    bookingSearchParams: BookingSearchParams;
    private _selectedCustomer: CustomerDO;
    isSearching: boolean = false;

    constructor(private _appContext: AppContext,
        private _bookingSearchService: BookingSearchService,
        private _searchTableMetaBuilder: BookingSearchResultsTableMetaBuilderService) { }

    ngOnInit() {
        this.bookingSearchParams = new BookingSearchParams();
        this.bookingSearchParams.interval = this.searchInput.booking.interval;
        this.bookingSearchParams.transientBookingList = [];
        this.bookingSearchParams.configCapacity = this.searchInput.booking.configCapacity;
        this.bookingSearchParams.bookingIdToOmit = this.searchInput.booking.id;
        this.selectedCustomer = this.searchInput.customersContainer.getCustomerById(this.searchInput.booking.defaultBillingDetails.customerId);
    }
    public ngAfterViewInit() {
        this._searchResultsTableComponent.bootstrap(this._bookingSearchService, this.getTableMeta());
        this._searchResultsTableComponent.attachCustomCellClassGenerator(this._searchTableMetaBuilder.customCellClassGenerator);
    }
    private getTableMeta(): LazyLoadTableMeta {
        var tableMeta = this._searchTableMetaBuilder.buildSearchResultsTableMeta();
        tableMeta.autoSelectRows = true;
        tableMeta.supportedRowCommandList = [TableRowCommand.Select];
        return tableMeta;
    }

    public get customerList(): CustomerDO[] {
        return this.searchInput.customersContainer.customerList;
    }

    public get selectedCustomer(): CustomerDO {
        return this._selectedCustomer;
    }
    public set selectedCustomer(selectedCustomer: CustomerDO) {
        this._selectedCustomer = selectedCustomer;
        this.bookingSearchParams.customerId = selectedCustomer.id;
    }
    public searchBookings() {
        this.isSearching = true;
        this._bookingSearchService.searchBookings(this.bookingSearchParams)
            .subscribe((searchResult: { roomCategoryList: RoomCategoryDO[], bookingItemList: BookingCartItemVM[] }) => {
                this.isSearching = false;
            }, (error: ThError) => {
                this.isSearching = false;
                this._appContext.toaster.error(error.message);
            });
    }

    public selectBookingCartItem(bookingCartItemVM: BookingCartItemVM) {
        if (bookingCartItemVM.itemType === BookingCartItemVMType.Total) { return; }
        this.triggerOnBookingCartItemVMSelected(bookingCartItemVM);
    }
}