import {InventoryScreenAction} from '../InventoryScreenAction';
import {InventoryScreenStateType} from '../InventoryScreenStateType';

export interface IInventoryState<T> {
	currentItem: T;
	canPerformAction(action: InventoryScreenAction, item?: T): Promise<InventoryScreenStateType>;
	getScreenStateType(): InventoryScreenStateType;
}