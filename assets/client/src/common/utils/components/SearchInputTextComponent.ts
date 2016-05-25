import {Component, AfterViewInit, Inject, ElementRef, Input} from '@angular/core';
import {AppContext} from '../AppContext';
import {LazyLoadData} from '../../../pages/internal/services/common/ILazyLoadRequestService';
import {ITextSearchRequestService} from '../../../pages/internal/services/common/ITextSearchRequestService';

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

	private _textSearchService: ITextSearchRequestService<T>;
	private _searchInputParams: SearchInputTextParams;

	constructor( @Inject(ElementRef) private _elementRef: ElementRef,
		private _appContext: AppContext) {
	}

	bootstrap(textSearchService: ITextSearchRequestService<T>, searchInputParams: SearchInputTextParams) {
		this._textSearchService = textSearchService;
		this._searchInputParams = searchInputParams;
	}

	ngAfterViewInit() {
		var jQueryElement: any = $(this._elementRef.nativeElement).find(".search-input-text");
		jQueryElement.select2({
			minimumInputLength: 2,
			maximumSelectionLength: 1,
			multiple: true,
			width: "100%",
			placeholder: this._appContext.thTranslation.translate(this.placeholder),
			ajax: {
				transport: ((params, success, failure) => {
					if (!this._textSearchService) { return; }
					this._textSearchService.filterItemsByText(params.data.term);
					this._textSearchService.getDataObservable().subscribe((lazyLoadData: LazyLoadData<T>) => {
						var valueArray = this.getStringArrayFromLazyLoadData(lazyLoadData);
						success({ results: valueArray, more: false, error: null });
					}, (err: any) => {
						failure(err);
					});
				}),
				delay: SearchInputTextComponent.Delay
			},
			language: this._appContext.thTranslation.getLocaleString()
		});
		jQueryElement.on("select2:select", ((selectedItem) => {
			console.log(selectedItem.params.data.item);
		}));
		jQueryElement.on("select2:unselect", ((selectedItem) => {
			console.log(selectedItem.params.data.item);
		}));
	}
	private getStringArrayFromLazyLoadData(lazyLoadData: LazyLoadData<T>): { id: string, text: string, item: T }[] {
		return _.map(lazyLoadData.pageContent.pageItemList, (item: T) => {
			return {
				id: this._appContext.thUtils.getObjectValueByPropertyStack(item, this._searchInputParams.objectPropertyId),
				text: this._appContext.thUtils.getObjectValueByPropertyStack(item, this._searchInputParams.displayStringPropertyId),
				item: item
			};
		});
	}


}