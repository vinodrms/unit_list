import { Component, AfterViewInit, Inject, Output, EventEmitter, ElementRef, Input } from '@angular/core';
import { AppContext } from '../AppContext';
import { LazyLoadData } from '../../../pages/internal/services/common/ILazyLoadRequestService';
import { ITextSearchRequestService } from '../../../pages/internal/services/common/ITextSearchRequestService';

import * as _ from "underscore";

declare var $: any;

export interface SearchInputTextParams {
	objectPropertyId: string;
	displayStringPropertyId: string;
}

@Component({
	selector: 'search-input-text',
	template: `
		<select class="search-input-text">
		</select>
	`
})
export class SearchInputTextComponent<T> implements AfterViewInit {
	public static Delay: number = 250;
	@Input() placeholder: string = "Insert a text";
	@Input() set preselectedItem(item: T) {
		this.selectItem(item);
	}

	@Output() onItemSelected = new EventEmitter<T>();
	@Output() onItemDeselected = new EventEmitter<T>();

	private jQueryElement: any;
	private _textSearchService: ITextSearchRequestService<T>;
	private _searchInputParams: SearchInputTextParams;
	private _currentSelectedItemId: string = "";

	constructor( @Inject(ElementRef) private _elementRef: ElementRef,
		private _appContext: AppContext) {
	}

	bootstrap(textSearchService: ITextSearchRequestService<T>, searchInputParams: SearchInputTextParams) {
		this._textSearchService = textSearchService;
		this._searchInputParams = searchInputParams;
	}

	ngAfterViewInit() {
		this.jQueryElement = $(this._elementRef.nativeElement).find(".search-input-text");
		this.jQueryElement.select2({
			minimumInputLength: 2,
			width: "100%",
			placeholder: this._appContext.thTranslation.translate(this.placeholder),
			allowClear: true,
			ajax: {
				transport: ((params, success, failure) => {
					if (!this._textSearchService) { return; }
					this._textSearchService.searchItemsByText(params.data.term).subscribe((itemList: T[]) => {
						var selectResults = this.convertItemListToSelectResults(itemList);
						success({ results: selectResults, more: false, error: null });
					}, (err: any) => {
						failure(err);
					});
				}),
				delay: SearchInputTextComponent.Delay
			},
			language: this._appContext.thTranslation.getLocaleString()
		});
		this.jQueryElement.on("select2:select", ((selectedItem) => {
			var item: T = selectedItem.params.data.item;
			this._currentSelectedItemId = this.getItemId(item);
			this.onItemSelected.next(item);
		}));
		this.jQueryElement.on("select2:unselect", ((selectedItem) => {
			this._currentSelectedItemId = "";
			this.onItemDeselected.next(selectedItem.params.data.item);
		}));
	}
	private convertItemListToSelectResults(itemList: T[]): { id: string, text: string, item: T }[] {
		return _.map(itemList, (item: T) => {
			return this.convertItemToSelectResults(item);
		});
	}
	private convertItemToSelectResults(item: T): { id: string, text: string, item: T } {
		return {
			id: this.getItemId(item),
			text: this._appContext.thUtils.getObjectValueByPropertyStack(item, this._searchInputParams.displayStringPropertyId),
			item: item
		};
	}
	private getItemId(item: T): string {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, this._searchInputParams.objectPropertyId);
	}

	private selectItem(item: T) {
		if (!item || !this.jQueryElement) {
			return;
		}
		var convertedItem = this.convertItemToSelectResults(item);
		var newSelectedId = this.getItemId(item);
		if (newSelectedId !== this._currentSelectedItemId) {
			this._currentSelectedItemId = newSelectedId;
			this.jQueryElement.data('select2').trigger('select', { 'data': convertedItem });
		}
	}
}