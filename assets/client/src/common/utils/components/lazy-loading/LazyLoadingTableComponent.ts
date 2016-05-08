import {Component, OnInit, Output, EventEmitter, Input, AfterViewChecked, Inject, ElementRef} from '@angular/core';
import {Control} from '@angular/common';
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
import {CustomScroll} from '../../directives/CustomScroll';

declare var jQuery:any;

@Component({
	selector: 'lazy-loading-table',
	templateUrl: '/client/src/common/utils/components/lazy-loading/template/lazy-loading-table.html',
	directives: [LoadingComponent, CustomScroll],
	pipes: [TranslationPipe, PricePipe, PercentagePipe]
})
export class LazyLoadingTableComponent<T> {
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
	}

	@Output() protected onAdd = new EventEmitter();
	protected addItem() {
		this.onAdd.next({});
	}

	@Output() protected onCopy = new EventEmitter();
	protected copyItem(item: T) {
		this.deselectItemIfNecessary(item);
		this.onCopy.next(item);
	}

	@Output() protected onDelete = new EventEmitter();
	protected deleteItem(item: T) {
		this.deselectItemIfNecessary(item);
		this.onDelete.next(item);
	}

	@Output() protected onEdit = new EventEmitter();
	protected editItem(item: T) {
		this.deselectItemIfNecessary(item);
		this.selectTableItem(item);
		this.onEdit.next(item);
	}

	@Output() protected onSelect = new EventEmitter();
	@Output() protected onMultiSelect = new EventEmitter();

	protected didInit: boolean = false;

	protected lazyLoadingRequest: ILazyLoadRequestService<T>;
	protected tableMeta: LazyLoadTableMeta;
	protected columnMetaList: TableColumnMeta[];
	protected totalCount: TotalCountDO;
	protected pageMeta: PageMetaDO;
	protected itemList: T[] = [];
	protected selectedItemList: T[] = [];

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
		if(this.tableOptions.canMultiSelect) {
			if(this.isSelected(item)) {
				this.deselectItemIfNecessary(item);
			}
			else {
				this.selectTableItem(item);
			}
			this.onMultiSelect.next(this.selectedItemList);
		}
		else {
			this.deselectItemIfNecessary(item);
			this.selectTableItem(item);
			this.onSelect.next(item);	
		}
	}

	private deselectItemIfNecessary(item: T) {
		var itemId: string = this.getItemId(item);
		if (this.tableMeta.autoSelectRows) {
			this.deselectItem(itemId);
		}
	}
	public deselectItem(itemId?: string) {
		if(!itemId) {
			this.selectedItemList = [];	
		}
		else {
			this.selectedItemList = _.filter(this.selectedItemList, (innerItem: T) => { return this.getItemId(innerItem) !== itemId });	
		}
	}
	private selectTableItem(item: T) {
		if (this.tableMeta.autoSelectRows) {
			this.selectItem(item);
		}
	}
	public selectItem(item: T) {
		if(this.tableOptions.canMultiSelect) {
			if(!this.isSelected(item)) {
				this.selectedItemList.push(item);	
			}
		}
		else {
			this.selectedItemList = [item];	
		}
	}
	protected isSelected(item: T): boolean {
		var itemId: string = this.getItemId(item);
		var founditem: T = _.find(this.selectedItemList, (innerItem: T) => { return this.getItemId(innerItem) === itemId });
		return founditem != null;
	}

	private getSelectedItemIndexInPageItemList(): number {
		if (!this.selectedItemList || this.selectedItemList.length == 0) {
			return Math.floor(this.itemList.length / 2);
		}
		var selectedItemId = this.getItemId(this.selectedItemList[0]);
		for (var index = 0; index < this.itemList.length; index++) {
			if (this.getItemId(this.itemList[index]) === selectedItemId) {
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

	private getTableElement(): any {
		return $(this._elementRef.nativeElement).find("table.table");
	}
	
	public getTableClasses(): string {
		var classes = 'lazy-loading ';
		if((this.columnMetaList.length + 1) % 2 == 0) {
			classes += 'even-columns';
		}
		else {
			classes += 'odd-columns';
		}
		return classes;	
	}
	
	public getCellClasses(columnValueMeta: TableColumnValueMeta, isCollapsed: boolean): string {
		var classes = '';
		
		if(isCollapsed) {
			classes += columnValueMeta.collapsedStyle;
		}
		else {
			classes += columnValueMeta.normalStyle;
		}
		return classes;			
	}
	
	public getRowClasses(item: T) {
		var classes = '';
		
		if(this.isSelected(item) && (this.tableOptions.canSelect || this.tableOptions.canMultiSelect)) {
			classes += 'active ';	
		}
		classes += 'selectable-row';
		return classes;
	}
}