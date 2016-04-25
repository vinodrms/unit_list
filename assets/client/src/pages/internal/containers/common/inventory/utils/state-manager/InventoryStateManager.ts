import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {AppContext} from '../../../../../../../common/utils/AppContext';
import {InventoryScreenStateType} from './InventoryScreenStateType';
import {InventoryScreenAction} from './InventoryScreenAction';
import {IInventoryState} from './states/IInventoryState';
import {EditInventoryState} from './states/EditInventoryState';
import {ViewInventoryState} from './states/ViewInventoryState';

export class InventoryStateManager<T> implements IInventoryState<T> {
	private _stateChangedObservable: Observable<InventoryScreenStateType>;
	private _stateChangedObserver: Observer<InventoryScreenStateType>;
	
	private _stateList: IInventoryState<T>[];
	private _screenStateType: InventoryScreenStateType;
	private _currentState: IInventoryState<T>;

	constructor(appContext: AppContext, objectIdSelector: string) {
		this._stateList = [
			new ViewInventoryState<T>(appContext, objectIdSelector),
			new EditInventoryState<T>(appContext, objectIdSelector)
		];
		this._stateChangedObservable = new Observable<InventoryScreenStateType>((serviceObserver: Observer<InventoryScreenStateType>) => {
			this._stateChangedObserver = serviceObserver;
		});
		this.screenStateType = InventoryScreenStateType.View;
	}

	public get screenStateType(): InventoryScreenStateType {
		return this._screenStateType;
	}
	public set screenStateType(screenStateType: InventoryScreenStateType) {
		this._screenStateType = screenStateType;
		this._currentState = _.find(this._stateList, (state: IInventoryState<T>) => { return state.getScreenStateType() === this._screenStateType });
		if(this._stateChangedObserver) {
			this._stateChangedObserver.next(this._screenStateType);
		}
	}

	public get currentItem(): T {
		return this._currentState.currentItem;
	}
	public set currentItem(currentItem: T) {
		_.forEach(this._stateList, (state: IInventoryState<T>) => { state.currentItem = currentItem });
	}
	public canPerformAction(action: InventoryScreenAction, item?: T): Promise<any> {
		return this._currentState.canPerformAction(action, item);
	}
	public getScreenStateType(): InventoryScreenStateType {
		return this._screenStateType;
	}
	
	public get stateChangedObservable(): Observable<InventoryScreenStateType> {
		return this._stateChangedObservable;
	}
	public set stateChangedObservable(stateChangedObservable: Observable<InventoryScreenStateType>) {
		this._stateChangedObservable = stateChangedObservable;
	}
}