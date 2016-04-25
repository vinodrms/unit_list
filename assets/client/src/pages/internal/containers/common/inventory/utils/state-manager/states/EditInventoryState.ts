import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {InventoryScreenAction} from '../InventoryScreenAction';
import {AInventoryState} from './AInventoryState';
import {InventoryScreenStateType} from '../InventoryScreenStateType';

export class EditInventoryState<T> extends AInventoryState<T> {

	constructor(appContext: AppContext, objectIdSelector: string) {
		super(appContext, objectIdSelector, InventoryScreenStateType.Edit);
	}

	protected canPerformActionCore(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction, item?: T) {
		switch (action) {
			case InventoryScreenAction.Add:
				this.canPerformAddOrCopyAction(resolve, reject, action);
				break;
			case InventoryScreenAction.Copy:
				this.canPerformAddOrCopyAction(resolve, reject, action);
				break;
			case InventoryScreenAction.Delete:
				this.canPerformDeleteAction(resolve, reject, action, item);
				break;
			case InventoryScreenAction.Edit:
				this.canPerformEditOrSelectAction(resolve, reject, action, item);
				break;
			case InventoryScreenAction.Select:
				this.canPerformEditOrSelectAction(resolve, reject, action, item);
				break;
			default:
				break;
		}
	}
	private canPerformAddOrCopyAction(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction) {
		if (!this.currentItem) {
			resolve(InventoryScreenStateType.Edit);
			return;
		}
		this.confirmDataDiscard(() => {
			resolve(InventoryScreenStateType.Edit);
		}, () => {
			reject(InventoryScreenStateType.Edit);
		});
	}
	private canPerformDeleteAction(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction, newItem: T) {
		if (!this.currentItem) {
			resolve(InventoryScreenStateType.Edit);
			return;
		}
		var newItemId = this.getItemId(newItem);
		if (newItemId === this._currentItemId) {
			resolve(InventoryScreenStateType.View);
		}
		else {
			resolve(InventoryScreenStateType.Edit);
		}
	}
	private canPerformEditOrSelectAction(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction, newItem: T) {
		if (!this.currentItem) {
			resolve(InventoryScreenStateType.Edit);
			return;
		}
		var newItemId = this.getItemId(newItem);
		if (newItemId === this._currentItemId) {
			reject(InventoryScreenStateType.Edit);
			return;
		}

		this.confirmDataDiscard(() => {
			resolve(InventoryScreenStateType.Edit);
		}, () => {
			reject(InventoryScreenStateType.Edit);
		});
	}
}