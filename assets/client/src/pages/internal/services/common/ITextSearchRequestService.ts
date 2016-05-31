import {Observable} from 'rxjs/Observable';
import {PageContent, LazyLoadData, ILazyLoadRequestService} from './ILazyLoadRequestService';

export interface ITextSearchRequestService<T> {
	searchItemsByText(text: string): Observable<T[]>;
}