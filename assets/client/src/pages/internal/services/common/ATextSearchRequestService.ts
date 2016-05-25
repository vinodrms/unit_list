import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ITextSearchRequestService} from './ITextSearchRequestService';
import {PageMetaDO} from './data-objects/lazy-load/PageMetaDO';

export abstract class ATextSearchRequestService<T> implements ITextSearchRequestService<T> {
	public static DefaultPageSize: number = 30;
	private _pageMeta: PageMetaDO;

	constructor(protected _appContext: AppContext, private _pageDataApi: ThServerApi) {
		this._pageMeta = new PageMetaDO();
		this._pageMeta.pageNumber = 0;
		this._pageMeta.pageSize = ATextSearchRequestService.DefaultPageSize;
	}

	public searchItemsByText(text: string): Observable<T[]> {
		return this._appContext.thHttp.post(this._pageDataApi, this.getParameters(text))
			.flatMap((pageItemListDataObject: Object) => {
				return this.parsePageItemListData(pageItemListDataObject);
			});
	}
	private getParameters(text: string): Object {
		return { searchCriteria: this.getTextSearchCriteria(text), lazyLoad: this._pageMeta };
	}

	protected abstract parsePageItemListData(pageItemListDataObject: Object): Observable<T[]>;
	protected abstract getTextSearchCriteria(text: string): Object;
}