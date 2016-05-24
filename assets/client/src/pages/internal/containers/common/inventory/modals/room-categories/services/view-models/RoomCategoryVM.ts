import {RoomCategoryDO} from '../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryCapacityDO} from '../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO'
import {ThUtils} from '../../../../../../../../../common/utils/ThUtils';

export class RoomCategoryVM {
	private _thUtils: ThUtils;
	
	private _roomCategory: RoomCategoryDO;
	private _capacity: RoomCategoryCapacityDO;
	private _isEditing: boolean;
	private _isSaving: boolean;
	
	constructor() {
		this._isEditing = false;
		this._isSaving = false;
		this._thUtils = new ThUtils();
	}
	
	public get capacity(): RoomCategoryCapacityDO {
		return this._capacity;
	}
	public set capacity(capacity: RoomCategoryCapacityDO) {
		this._capacity = capacity;
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
	
	public get bedsConfigured(): boolean {
		return !this._thUtils.isUndefinedOrNull(this.capacity) && !this.capacity.isEmpty();
	}
}