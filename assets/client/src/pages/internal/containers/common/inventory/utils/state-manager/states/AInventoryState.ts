import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {InventoryScreenAction} from '../InventoryScreenAction';
import {IInventoryState} from './IInventoryState';
import {InventoryScreenStateType} from '../InventoryScreenStateType';

export abstract class AInventoryState<T> implements IInventoryState<T> {
	private _currentItem: T;
	protected _currentItemId: string;

	constructor(protected _appContext: AppContext,
		private _objectIdSelector: string,
		private _screenState: InventoryScreenStateType) {
	}

	public getScreenStateType(): InventoryScreenStateType {
		return this._screenState;
	}

	public canPerformAction(action: InventoryScreenAction, newItem?: T): Promise<InventoryScreenStateType> {
		return new Promise<InventoryScreenStateType>((resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }) => {
			this.canPerformActionCore(resolve, reject, action, newItem);
		});
	}
	protected abstract canPerformActionCore(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction, item?: T);

	protected confirmDataDiscard(onConfirmCallback: { (): void }, onRejectCallback?: { (): void }) {
		var title = this._appContext.thTranslation.translate("Confirm Discard");
		var content = this._appContext.thTranslation.translate("Are you sure you want to discard the current editing item ?");
		this._appContext.modalService.confirm(title, content, onConfirmCallback, onRejectCallback);
	}

	protected getItemId(item: T): string {
		return this._appContext.thUtils.getObjectValueByPropertyStack(item, this._objectIdSelector);
	}

	public get currentItem(): T {
		return this._currentItem;
	}
	public set currentItem(currentItem: T) {
		this._currentItem = currentItem;
		this._currentItemId = this.getItemId(currentItem);
	}
}