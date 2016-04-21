import {Component, OnInit, Output, EventEmitter, Input, AfterViewChecked, Inject, ElementRef} from 'angular2/core';
import {Control} from 'angular2/common';
import {LoadingComponent} from '../LoadingComponent';
import {TranslationPipe} from '../../localization/TranslationPipe';
import {PricePipe} from '../../pipes/PricePipe';
import {PercentagePipe} from '../../pipes/PercentagePipe';
import {AppContext} from '../../AppContext';
import {LazyLoadTableMeta, TableRowCommand, TableColumnValueMeta, TablePropertyType, TableViewOption, TableColumnMeta} from './utils/LazyLoadTableMeta';
import {ILazyLoadRequestService, LazyLoadData, PageContent} from '../../../../pages/internal/services/common/ILazyLoadRequestService';
import {TotalCountDO} from '../../../../pages/internal/services/common/data-objects/lazy-load/TotalCountDO';
import {PageMetaDO} from '../../../../pages/internal/services/common/data-objects/lazy-load/PageMetaDO';
import {PaginationIndex} from './utils/PaginationIndex';
import {TableOptions} from './utils/TableOptions';

@Component({
	selector: 'lazy-loading-table',
	templateUrl: '/client/src/common/utils/components/lazy-loading/template/lazy-loading-table.html',
	directives: [LoadingComponent],
	pipes: [TranslationPipe, PricePipe, PercentagePipe]
})
export class LazyLoadingTableComponent<T> implements AfterViewChecked {
	protected _isCollapsed: boolean;

	protected get isCollapsed(): boolean {
		return this._isCollapsed;
	}
	@Input()
	protected set isCollapsed(isCollapsed: boolean) {
		this._isCollapsed = isCollapsed;
		if (!this.tableMeta || !this.tableMeta.columnMetaList) {
			return;
		}
		this.filterColumnMetaList();

		if (this._isCollapsed && !this.paginationIndex.defaultNoOfItemsPerPageIsSelected()) {
			var selectedItemIndex = this.getSelectedItemIndexInPageItemList();
			var newPageNumber = this.paginationIndex.getUpdatedPageNumber(this.totalCount, this.pageMeta, selectedItemIndex);

			this.paginationIndex.numOfItemsPerPage = PaginationIndex.DefaultItemsPerPage;
			this.lazyLoadingRequest.updatePageNumberAndPageSize(newPageNumber, PaginationIndex.DefaultItemsPerPage);
		}
		this.reflowTableHeader();
	}

	@Output() protected onAdd = new EventEmitter();
	protected addItem() {
		this.onAdd.next({});
	}

	@Output() protected onCopy = new EventEmitter();
	protected copyItem(item: T) {
		this.deselectCurrentItem();
		this.onCopy.next(item);
	}

	@Output() protected onDelete = new EventEmitter();
	protected deleteItem(item: T) {
		this.deselectCurrentItem();
		this.onDelete.next(item);
	}

	@Output() protected onEdit = new EventEmitter();
	protected editItem(item: T) {
		this.deselectCurrentItem();
		this.selectTableItem(item);
		this.onEdit.next(item);
	}

	@Output() protected onSelect = new EventEmitter();

	protected didInit: boolean = false;
	protected domNeedsRefresh: boolean = false;

	protected lazyLoadingRequest: ILazyLoadRequestService<T>;
	protected tableMeta: LazyLoadTableMeta;
	protected columnMetaList: TableColumnMeta[];
	protected totalCount: TotalCountDO;
	protected pageMeta: PageMetaDO;
	protected itemList: T[] = [];
	protected selectedItemId: string = "";

	protected tableOptions: TableOptions;
	protected textSearchControl: Control;

	protected paginationIndex: PaginationIndex;

	constructor(private _appContext: AppContext,
		@Inject(ElementRef) private _elementRef: ElementRef) {
		this.paginationIndex = new PaginationIndex(_appContext);
		this.tableOptions = new TableOptions();
	}

	public bootstrap(lazyLoadingRequest: ILazyLoadRequestService<T>, tableMeta: LazyLoadTableMeta) {
		//wait for next tick
        setTimeout(() => {
			this.lazyLoadingRequest = lazyLoadingRequest;
			this.tableMeta = tableMeta;

			this.attachRequestObservable();
			this.tableOptions.updatePageOptions(tableMeta);
		});
	}
	private attachRequestObservable() {
		this.lazyLoadingRequest.getDataObservable().subscribe((lazyLoadData: LazyLoadData<T>) => {
            this.totalCount = lazyLoadData.totalCount;
			this.pageMeta = lazyLoadData.pageContent.pageMeta;
			this.itemList = lazyLoadData.pageContent.pageItemList;

			this.paginationIndex.buildPaginationOptions(this.totalCount, this.pageMeta);
			this.checkInvalidPageNumber();
			this.registerSearchInputObservable();
			this.filterColumnMetaList();

			this.didInit = true;
			this.domNeedsRefresh = true;
		});
		this.lazyLoadingRequest.refreshData();
	}

	private checkInvalidPageNumber() {
		if (this.paginationIndex.isInvalidPageNumber(this.totalCount, this.pageMeta)) {
			this.lazyLoadingRequest.updatePageNumber(this.paginationIndex.lastPageNumber);
		}
	}
	private registerSearchInputObservable() {
		if (this.textSearchControl) {
			return;
		}
		this.textSearchControl = new Control("");
		this.textSearchControl.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe((text: string) => {
				this.searchByText();
			});
	}
	private filterColumnMetaList() {
		if (this.isCollapsed) {
			this.columnMetaList = _.filter(this.tableMeta.columnMetaList, (columnMeta: TableColumnMeta) => { return columnMeta.valueMeta.showInCollapsedView; });
		}
		else {
			this.columnMetaList = this.tableMeta.columnMetaList;
		}
	}

	protected searchByText() {
		this.lazyLoadingRequest.searchByText(this.textSearchControl.value);
	}

	protected isFirstPage(): boolean {
		return this.pageMeta.pageNumber === this.paginationIndex.firstPageNumber;
	}
	protected isLastPage(): boolean {
		return this.pageMeta.pageNumber === this.paginationIndex.lastPageNumber;
	}
	protected updatePageNumber(pageNumber: number) {
		if (pageNumber >= this.paginationIndex.firstPageNumber && pageNumber <= this.paginationIndex.lastPageNumber) {
			this.lazyLoadingRequest.updatePageNumber(pageNumber);
		}
	}

	protected isPercentage(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.PercentageType;
	}
	protected isPrice(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.PriceType;
	}
	protected isStringOrNumber(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.NumberType || valueMeta.propertyType === TablePropertyType.StringType;
	}
	protected isNotes(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.NotesType;
	}
    protected isCapacity(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.CapacityType;
	}
    protected isFontIcon(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.FontIconType;
	}
	protected noResultsExist(): boolean {
		return this.totalCount.numOfItems === 0 && this.itemList.length === 0;
	}

	protected didChangeNumOfItemsPerPage(newValue: string) {
		this.paginationIndex.numOfItemsPerPage = parseInt(newValue);
		this.lazyLoadingRequest.updatePageSize(this.paginationIndex.numOfItemsPerPage);
	}

	protected didSelectItem(item: T) {
		this.deselectCurrentItem();
		this.selectTableItem(item);
		this.onSelect.next(item)
	}

	private deselectCurrentItem() {
		if (this.tableMeta.autoSelectRows) {
			this.deselectItem();
		}
	}
	public deselectItem() {
		this.selectedItemId = "";
	}
	private selectTableItem(item: T) {
		if (this.tableMeta.autoSelectRows) {
			this.selectItem(this.getItemId(item));
		}
	}
	public selectItem(itemId: string) {
		this.selectedItemId = itemId;
	}
	protected isSelected(item: T) {
		return this.getItemId(item) === this.selectedItemId;
	}

	private getSelectedItemIndexInPageItemList(): number {
		if (!this.selectedItemId) {
			return Math.floor(this.itemList.length / 2);
		}
		for (var index = 0; index < this.itemList.length; index++) {
			if (this.getItemId(this.itemList[index]) === this.selectedItemId) {
				return index;
			}
		}
	}
	private getItemId(item: T): string {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, this.tableMeta.rowIdPropertySelector);
	}

	protected getItemValue(item: T, valueMeta: TableColumnValueMeta): any {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, valueMeta.objectPropertyId);
	}
	protected getDependentItemValue(item: T, valueMeta: TableColumnValueMeta): any {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, valueMeta.dependentObjectPropertyId);
	}


	public ngAfterViewChecked() {
		if (this.domNeedsRefresh) {
			this.makeTableHeaderFloatable();
			this.domNeedsRefresh = false;
		}
	}
	private makeTableHeaderFloatable() {
		// TODO: decomment to allow sticky header
		// this.getTableElement().floatThead({ position: 'fixed' });
	}
	private reflowTableHeader() {
		setTimeout(()=>{
			// TODO: decomment to allow sticky header
			// this.getTableElement().floatThead('reflow');
		}, 0);
	}
	private getTableElement(): any {
		return $(this._elementRef.nativeElement).find("table.table");
	}
}