import {Observable} from 'rxjs/Observable';
import {PageContent, LazyLoadData, ILazyLoadRequestService} from './ILazyLoadRequestService';

export interface ITextSearchRequestService<T> {
	getDataObservable(): Observable<LazyLoadData<T>>;
	filterItemsByText(text: string);
}