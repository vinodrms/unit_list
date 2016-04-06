import {Observable} from 'rxjs/Observable';
import {PageMetaDO} from './data-objects/lazy-load/PageMetaDO';
import {TotalCountDO} from './data-objects/lazy-load/TotalCountDO';

export interface PageContent<T> {
	pageMeta: PageMetaDO;
	pageItemList: T[];
}
export interface LazyLoadData<T> {
	totalCount: TotalCountDO;
	pageContent: PageContent<T>;
}

export interface ILazyLoadRequestService<T> {
	updateSearchCriteria(searchCriteria: Object);
	updatePageNumber(pageNumber: number);
	updatePageSize(pageSize: number);
	updatePageNumberAndPageSize(pageNumber: number, pageSize: number);
	getDataObservable(): Observable<LazyLoadData<T>>;
	searchByText(text: string);
	refreshData();
}