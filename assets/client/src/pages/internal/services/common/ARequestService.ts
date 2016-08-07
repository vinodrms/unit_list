import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';
import {BaseDO} from '../../../../common/base/BaseDO';
import {ThError} from '../../../../common/utils/responses/ThError';

export abstract class ARequestService<T> {
	private _serviceObservable: Observable<T>;
	private _serviceObserver: Observer<T>;

	protected _requestResult: BehaviorSubject<T>;
	private _inProgressRequest: boolean;

	constructor() {
		this._serviceObservable = new Observable<T>((serviceObserver: Observer<T>) => {
			this._serviceObserver = serviceObserver;
		}).share();
		this._inProgressRequest = false;
	}

	protected getServiceObservable(): Observable<T> {
		if (!this._requestResult) {
			if (this._inProgressRequest) {
				return this._serviceObservable;
			}
			this._inProgressRequest = true;
			this.sendRequest().subscribe((result: Object) => {
				var parsedResult: T = this.parseResult(result);

				this._requestResult = new BehaviorSubject<T>(parsedResult);
				this._serviceObservable.subscribe(s => this._requestResult.next(s));

				this._inProgressRequest = false;
				this._serviceObserver.next(parsedResult);
			}, (error: ThError) => {
				this._inProgressRequest = false;
				this._serviceObserver.error(error);
			});
			return this._serviceObservable;
		}
		else {
			return this._requestResult;
		}
	}
	protected updateServiceResult() {
		this._inProgressRequest = true;
		this.sendRequest().subscribe((result: Object) => {
			var parsedResult: T = this.parseResult(result);
			this._inProgressRequest = false;
			this._serviceObserver.next(parsedResult);
		}, (error: ThError) => {
			this._inProgressRequest = false;
			this._serviceObserver.error(error);
		});
	}

	protected abstract sendRequest(): Observable<Object>;
	protected abstract parseResult(result: Object): T;
	protected updateResult(result: T) {
		this._serviceObserver.next(result);
	}
}