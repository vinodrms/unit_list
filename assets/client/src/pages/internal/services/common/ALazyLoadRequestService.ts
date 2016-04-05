import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {ILazyLoadRequestService, PageContent, LazyLoadData} from './ILazyLoadRequestService';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {PageMetaDO} from './data-objects/lazy-load/PageMetaDO';
import {TotalCountDO} from './data-objects/lazy-load/TotalCountDO';

export abstract class ALazyLoadRequestService<T> implements ILazyLoadRequestService<T> {
	private static DefaultPageSize = 10;

	private _countObservable: Observable<TotalCountDO>;
	private _countObserver: Observer<TotalCountDO>;

	private _pageDataObservable: Observable<T[]>;
	private _pageDataObserver: Observer<T[]>;

	protected _searchCriteria: Object;
	private _pageMeta: PageMetaDO;

	constructor(protected _appContext: AppContext, private _countApi: ThServerApi, private _pageDataApi: ThServerApi) {
		this.initSearchCriteria();
		this.initPageMeta();
		this.initCountObservable();
		this.initPageDataObservable();
	}
	private initSearchCriteria() {
		this._searchCriteria = {};
	}
	private initPageMeta() {
		this._pageMeta = new PageMetaDO();
		this._pageMeta.pageNumber = 0;
		this._pageMeta.pageSize = ALazyLoadRequestService.DefaultPageSize;
	}
	private initCountObservable() {
		this._countObservable = new Observable((serviceObserver: Observer<TotalCountDO>) => {
			this._countObserver = serviceObserver;
		});
	}
	private initPageDataObservable() {
		this._pageDataObservable = new Observable((serviceObserver: Observer<T[]>) => {
			this._pageDataObserver = serviceObserver;
		});
	}

	public refreshData() {
		this.updateCount();
		this.updatePageData();
	}
	public updateSearchCriteria(searchCriteria: Object) {
		this._searchCriteria = searchCriteria;
		this.refreshData();
	}
	public updatePageNumber(pageNumber: number) {
		this._pageMeta.pageNumber = pageNumber;
		this.updatePageData();
	}
	public updatePageSize(pageSize: number) {
		this._pageMeta.pageSize = pageSize;
		this._pageMeta.pageNumber = 0;
		this.updatePageData();
	}

	private updateCount() {
		this._appContext.thHttp.post(this._countApi, this.getParameters()).map((countObject: Object) => {
			var countDO = new TotalCountDO();
			countDO.buildFromObject(countObject);
			return countDO;
		}).subscribe((totalCountDO: TotalCountDO) => {
			this._countObserver.next(totalCountDO);
		}, (error: any) => {
			this._countObserver.error(error);
		});
	}
	private updatePageData() {
		this._appContext.thHttp.post(this._pageDataApi, this.getParameters())
			.map((pageDataObject: Object) => {
				var pageMeta: PageMetaDO = new PageMetaDO();
				pageMeta.buildFromObject(pageDataObject["lazyLoad"]);
				return {
					pageMeta: pageMeta,
					pageItemList: pageDataObject
				}
			})
			.flatMap((pageContent: PageContent<Object>) => {
				return this.parsePageData(pageContent);
			})
			.subscribe((pageContent: PageContent<T>) => {
				if (pageContent.pageMeta.pageNumber === this._pageMeta.pageNumber) {
					this._pageDataObserver.next(pageContent.pageItemList);
				}
			}, (error: any) => {
				this._pageDataObserver.error(error);
			});
	}
	private getParameters(): Object {
		return { searchCriteria: this._searchCriteria, lazyLoad: this._pageMeta };
	}

	public getDataObservable(): Observable<LazyLoadData<T>> {
		return Observable.combineLatest(
			this._countObservable,
			this._pageDataObservable
		).map((result: [TotalCountDO, T[]]) => {
			var lazyLoadData: LazyLoadData<T> = {
				totalCount: result[0],
				pageContent: {
					pageItemList: result[1],
					pageMeta: this._pageMeta
				}
			};
			return lazyLoadData;
		});
	}

	private parsePageData(pageContent: PageContent<Object>): Observable<PageContent<T>> {
		return this.parsePageDataCore(pageContent.pageItemList).map((pageDataDOList: T[]) => {
			return {
				pageMeta: pageContent.pageMeta,
				pageItemList: pageDataDOList
			}
		});
	}
	protected abstract parsePageDataCore(pageDataObject: Object): Observable<T[]>;
	public abstract searchByText(text: string);
}