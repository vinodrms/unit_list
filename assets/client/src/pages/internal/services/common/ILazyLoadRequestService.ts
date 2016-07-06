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
export enum SortOrder {
	Descending = -1,
	Ascending = 1
}
export interface SortOptions {
	objectPropertyId: string;
	sortOrder: SortOrder;
}

export interface ILazyLoadRequestService<T> {
	updateSearchCriteria(searchCriteria: Object);
	updatePageNumber(pageNumber: number);
	updatePageSize(pageSize: number);
	updatePageNumberAndPageSize(pageNumber: number, pageSize: number);
	getDataObservable(): Observable<LazyLoadData<T>>;
	searchByText(text: string);
	refreshData();
	showPagination(): boolean;
	sort(sortOptions: SortOptions);
	getSortedOptions(): SortOptions;
}