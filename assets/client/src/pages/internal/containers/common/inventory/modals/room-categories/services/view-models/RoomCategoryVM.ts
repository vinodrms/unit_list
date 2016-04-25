import {RoomCategoryDO} from '../../../../../../../services/room-categories/data-objects/RoomCategoryDO';

export class RoomCategoryVM {
	private _roomCategory: RoomCategoryDO;
	private _isEditing: boolean;
	private _isSaving: boolean;
	
	constructor() {
		this._isEditing = false;
		this._isSaving = false;
	}
	
	public get roomCategory(): RoomCategoryDO {
		return this._roomCategory;
	}
	public set roomCategory(roomCategory: RoomCategoryDO) {
		this._roomCategory = roomCategory;
	}
	public get isEditing(): boolean {
		return this._isEditing;
	}
	public set isEditing(isEditing: boolean) {
		this._isEditing = isEditing;
	}
	public get isSaving(): boolean {
		return this._isSaving;
	}
	public set isSaving(isSaving: boolean) {
		this._isSaving = isSaving;
	}
}