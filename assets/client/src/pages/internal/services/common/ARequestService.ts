import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/share';
import {BaseDO} from '../../../../common/base/BaseDO';
import {ThError} from '../../../../common/utils/responses/ThError';

export abstract class ARequestService {
	private _serviceObservable: Observable<BaseDO>;
	private _serviceObserver: Observer<BaseDO>;

	protected _requestResult: BehaviorSubject<BaseDO>;

	constructor() {
		this._serviceObservable = new Observable((serviceObserver: Observer<BaseDO>) => {
			this._serviceObserver = serviceObserver;
		}).share();
	}

	protected getServiceObservable(): Observable<BaseDO> {
		if (!this._requestResult) {
			this.sendRequest().subscribe((result: Object) => {
				var parsedResult = this.parseResult(result);

				this._requestResult = new BehaviorSubject(parsedResult);
				this._serviceObservable.subscribe(s => this._requestResult.next(s));

				this._serviceObserver.next(parsedResult);
			}, (error: ThError) => {
				this._serviceObserver.error(error);
			});
			return this._serviceObservable;
		}
		else {
			return this._requestResult;
		}
	}

	protected abstract sendRequest(): Observable<Object>;
	protected abstract parseResult(result: Object): BaseDO;
}