import {Component, OnInit, Output, EventEmitter, Input} from 'angular2/core';
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

interface PagePaginationIndex {
	pageNumber: number;
	displayNumber: number;
	isSelected: boolean;
}
class TableItem<T> {
	isSelected: boolean;
	item: T;
}

@Component({
	selector: 'lazy-loading-table',
	templateUrl: "/client/src/common/utils/components/lazy-loading/template/lazy-loading-table.html",
	directives: [LoadingComponent],
	pipes: [TranslationPipe, PricePipe, PercentagePipe]
})
export class LazyLoadingTableComponent<T> {
	private _isCollapsed: boolean;

	public get isCollapsed(): boolean {
		return this._isCollapsed;
	}
	@Input()
	public set isCollapsed(isCollapsed: boolean) {
		this._isCollapsed = isCollapsed;
		if (!this.tableMeta || !this.tableMeta.columnMetaList) {
			return;
		}
		this.updateColumnMetaList();
	}

	@Output() onAdd = new EventEmitter();
	public addItem() {
		this.onAdd.next({});
	}

	@Output() onCopy = new EventEmitter();
	public copyItem(itemVM: TableItem<T>) {
		this.deselectItemsDifferentThan(itemVM.item);
		itemVM.isSelected = false;
		this.onCopy.next(itemVM.item);
	}

	@Output() onDelete = new EventEmitter();
	public deleteItem(itemVM: TableItem<T>) {
		this.deselectItemsDifferentThan(itemVM.item);
		itemVM.isSelected = true;
		this.onDelete.next(itemVM.item);
	}

	@Output() onEdit = new EventEmitter();
	public editItem(itemVM: TableItem<T>) {
		this.deselectItemsDifferentThan(itemVM.item);
		itemVM.isSelected = true;
		this.onEdit.next(itemVM.item);
	}

	@Output() onSelect = new EventEmitter();

	didInit: boolean = false;
	numOfItemsPerPage: number = 10;
	lazyLoadingRequest: ILazyLoadRequestService<T>;

	tableMeta: LazyLoadTableMeta;
	columnMetaList: TableColumnMeta[];
	totalCount: TotalCountDO;
	pageMeta: PageMetaDO;
	itemVMList: TableItem<T>[];

	canSelect: boolean = false;
	canCopy: boolean = false;
	canEdit: boolean = false;
	canDelete: boolean = false;
	canAdd: boolean = false;
	canSearch: boolean = false;
	textSearchControl: Control;

	firstPageNumber: number;
	lastPageNumber: number;
	paginationIndexList: PagePaginationIndex[];
	pageNumberStat: string;

	constructor(private _appContext: AppContext) {
	}

	public bootstrap(lazyLoadingRequest: ILazyLoadRequestService<T>, tableMeta: LazyLoadTableMeta) {
		setTimeout(() => {
			this.lazyLoadingRequest = lazyLoadingRequest;
			this.attachRequestObservable();
			this.tableMeta = tableMeta;
			this.updatePageOptions();
		});
	}
	private updatePageOptions() {
		this.canSelect = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Select);
		this.canEdit = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Edit);
		this.canCopy = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Copy);
		this.canDelete = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Delete);
		this.canAdd = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Add);
		if (this.canAdd && !this.tableMeta.addButtonText) {
			this.tableMeta.addButtonText = "Add";
		}
		this.canSearch = _.contains(this.tableMeta.supportedRowCommandList, TableRowCommand.Search);
		if (this.canSearch && !this.tableMeta.searchInputPlaceholder) {
			this.tableMeta.searchInputPlaceholder = "Search";
		}
	}
	private attachRequestObservable() {
		this.lazyLoadingRequest.getDataObservable().subscribe((lazyLoadData: LazyLoadData<T>) => {
			this.totalCount = lazyLoadData.totalCount;
			this.pageMeta = lazyLoadData.pageContent.pageMeta;

			this.updatePageItemVMList(lazyLoadData);
			this.buildPaginationOptions();
			this.registerSearchInputObservable();
			this.updateColumnMetaList();

			this.didInit = true;
		});
		this.lazyLoadingRequest.refreshData();
	}
	private updatePageItemVMList(lazyLoadData: LazyLoadData<T>) {
		this.itemVMList = [];
		_.forEach(lazyLoadData.pageContent.pageItemList, (item: T) => {
			var newItem = new TableItem<T>();
			newItem.isSelected = false;
			newItem.item = item;
			this.itemVMList.push(newItem);
		});
	}
	private buildPaginationOptions() {
		this.firstPageNumber = 0;
		this.lastPageNumber = this.totalCount.getLastPageIndex(this.numOfItemsPerPage);
		this.paginationIndexList = [];
		this.addPaginationIndex(this.pageMeta.pageNumber - 1);
		this.addPaginationIndex(this.pageMeta.pageNumber);
		this.addPaginationIndex(this.pageMeta.pageNumber + 1);

		var fromIndex = (this.pageMeta.pageNumber * this.pageMeta.pageSize) + 1;
		if (this.totalCount.numOfItems == 0) {
			fromIndex = 0;
		}
		this.pageNumberStat = this._appContext.thTranslation.translate("Showing %fromIndex% to %toIndex% of %totalCount% items",
			{
				fromIndex: fromIndex,
				toIndex: Math.min(((this.pageMeta.pageNumber + 1) * this.pageMeta.pageSize), this.totalCount.numOfItems),
				totalCount: this.totalCount.numOfItems
			})
	}
	private addPaginationIndex(pageNumber: number) {
		if (pageNumber < this.firstPageNumber || pageNumber > this.lastPageNumber) {
			return;
		}
		this.paginationIndexList.push({
			displayNumber: pageNumber + 1,
			pageNumber: pageNumber,
			isSelected: pageNumber === this.pageMeta.pageNumber
		});
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
	private updateColumnMetaList() {
		if (this.isCollapsed) {
			this.columnMetaList = _.filter(this.tableMeta.columnMetaList, (columnMeta: TableColumnMeta) => {
				return columnMeta.valueMeta.showInCollapsedView;
			});
			return;
		}
		this.columnMetaList = this.tableMeta.columnMetaList;
	}


	public searchByText() {
		this.lazyLoadingRequest.searchByText(this.textSearchControl.value);
	}

	public isFirstPage(): boolean {
		return this.pageMeta.pageNumber === this.firstPageNumber;
	}
	public isLastPage(): boolean {
		return this.pageMeta.pageNumber === this.lastPageNumber;
	}
	public updatePageNumber(pageNumber: number) {
		if (pageNumber >= this.firstPageNumber && pageNumber <= this.lastPageNumber) {
			this.lazyLoadingRequest.updatePageNumber(pageNumber);
		}
	}

	public isPercentage(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.PercentageType;
	}
	public isPrice(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.PriceType;
	}
	public isStringOrNumber(valueMeta: TableColumnValueMeta): boolean {
		return valueMeta.propertyType === TablePropertyType.NumberType || valueMeta.propertyType === TablePropertyType.StringType;
	}

	public didChangeNumOfItemsPerPage(newValue: string) {
		this.numOfItemsPerPage = parseInt(newValue);
		this.lazyLoadingRequest.updatePageSize(this.numOfItemsPerPage);
	}

	public onItemSelected(item: T, eventValue: any): boolean {
		this.deselectItemsDifferentThan(item);
		if (eventValue) {
			this.onSelect.next(item);
		}
		return true;
	}
	public markSelected(itemVM: TableItem<T>) {
		itemVM.isSelected = true;
	}
	private deselectItemsDifferentThan(item: T) {
		var selectedId = this.getItemId(item);
		_.forEach(this.itemVMList, (listItem: TableItem<T>) => {
			if (selectedId !== this.getItemId(listItem.item)) {
				listItem.isSelected = false;
			}
		});
	}
	private getItemId(item: T): string {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, this.tableMeta.rowIdPropertySelector);
	}

	public getItemValue(item: T, valueMeta: TableColumnValueMeta): any {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, valueMeta.objectPropertyId);
	}
	public getDependentItemValue(item: T, valueMeta: TableColumnValueMeta): any {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, valueMeta.dependentObjectPropertyId);
	}
}