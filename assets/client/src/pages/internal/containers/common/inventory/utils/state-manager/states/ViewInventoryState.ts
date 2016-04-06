import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {InventoryScreenAction} from '../InventoryScreenAction';
import {AInventoryState} from './AInventoryState';
import {InventoryScreenStateType} from '../InventoryScreenStateType';

export class ViewInventoryState<T> extends AInventoryState<T> {

	constructor(appContext: AppContext, objectIdSelector: string) {
		super(appContext, objectIdSelector, InventoryScreenStateType.View);
	}

	protected canPerformActionCore(resolve: { (result: InventoryScreenStateType): void }, reject: { (err: any): void }, action: InventoryScreenAction, item?: T) {
		switch (action) {
			case InventoryScreenAction.Add:
				resolve(InventoryScreenStateType.Edit);
				break;
			case InventoryScreenAction.Copy:
				resolve(InventoryScreenStateType.Edit);
				break;
			case InventoryScreenAction.Delete:
				resolve(InventoryScreenStateType.View);
				break;
			case InventoryScreenAction.Edit:
				resolve(InventoryScreenStateType.Edit);
				break;
			case InventoryScreenAction.Select:
				resolve(InventoryScreenStateType.View);
				break;
			default:
				break;
		}
	}
}