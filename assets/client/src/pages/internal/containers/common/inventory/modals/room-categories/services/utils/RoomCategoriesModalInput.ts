export class RoomCategoriesModalInput {
	private _allowCategoryEdit: boolean;
	private _initialRoomCategoryId: string;
	
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
}