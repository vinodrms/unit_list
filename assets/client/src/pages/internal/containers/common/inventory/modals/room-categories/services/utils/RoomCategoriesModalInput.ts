import {RoomCategoriesType} from '../../../../../../../services/room-categories/RoomCategoriesService';

export class RoomCategoriesModalInput {
	private _allowCategoryEdit: boolean;
	private _initialRoomCategoryId: string;
	private _roomCategoriesType: RoomCategoriesType;
	
	public get allowCategoryEdit(): boolean {
		return this._allowCategoryEdit;
	}
	public set allowCategoryEdit(allowCategoryEdit: boolean) {
		this._allowCategoryEdit = allowCategoryEdit;
	}
	public get initialRoomCategoryId(): string {
		return this._initialRoomCategoryId;
	}
	public set initialRoomCategoryId(initialRoomCategoryId: string) {
		this._initialRoomCategoryId = initialRoomCategoryId;
	}
	public get roomCategoriesType(): RoomCategoriesType {
		return this._roomCategoriesType;
	}
	public set roomCategoriesType(roomCategoriesType: RoomCategoriesType) {
		this._roomCategoriesType = roomCategoriesType;
	}
}