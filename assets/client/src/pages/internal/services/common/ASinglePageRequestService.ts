import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {ILazyLoadRequestService, LazyLoadData, SortOrder, SortOptions} from './ILazyLoadRequestService';
import {TotalCountDO} from './data-objects/lazy-load/TotalCountDO';
import {PageMetaDO} from './data-objects/lazy-load/PageMetaDO';

export abstract class ASinglePageRequestService<T> implements ILazyLoadRequestService<T> {
    private _pageDataObservable: Observable<T[]>;
    private _pageDataObserver: Observer<T[]>;

    constructor() {
        this.initPageDataObservable();
    }
    private initPageDataObservable() {
        this._pageDataObservable = new Observable<T[]>((serviceObserver: Observer<T[]>) => {
            this._pageDataObserver = serviceObserver;
        });
    }

    public getDataObservable(): Observable<LazyLoadData<T>> {
        return this._pageDataObservable
            .map((pageItemList: T[]) => {
                var totalCount = new TotalCountDO();
                totalCount.numOfItems = pageItemList.length;
                var pageMeta = new PageMetaDO();
                pageMeta.pageNumber = 0;
                pageMeta.pageSize = totalCount.numOfItems;
                var lazyLoadData: LazyLoadData<T> = {
                    totalCount: totalCount,
                    pageContent: {
                        pageItemList: pageItemList,
                        pageMeta: pageMeta
                    }
                };
                return lazyLoadData;
            });
    }
    public refreshData() {
        this.getPageItemList().subscribe((pageItemList: T[]) => {
            this._pageDataObserver.next(pageItemList);
        }, (error: any) => {
            this._pageDataObserver.error(error);
        });
    }

    public updatePageNumber(pageNumber: number) { }
    public updatePageSize(pageSize: number) { }
    public updatePageNumberAndPageSize(pageNumber: number, pageSize: number) { }
    public searchByText(text: string) { }
    public updateSearchCriteria(searchCriteria: Object) { }

    public showPagination(): boolean {
        return false;
    }

    protected updatePageItemList(pageItemList: T[]) {
        this._pageDataObserver.next(pageItemList);
    }
    protected abstract getPageItemList(): Observable<T[]>;

    // override if require sort
    public sort(sortOptions: SortOptions) { }
    public getSortedOptions(): SortOptions { return null; }
}