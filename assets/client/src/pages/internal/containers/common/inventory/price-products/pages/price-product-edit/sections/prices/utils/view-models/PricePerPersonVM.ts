import {PricePerPersonDO} from '../../../../../../../../../../services/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import {RoomCategoryStatsDO} from '../../../../../../../../../../services/room-categories/data-objects/RoomCategoryStatsDO';

export class PricePerPersonVM {
	private _pricePerPerson: PricePerPersonDO;
	private _roomCategoryStats: RoomCategoryStatsDO;
	private _previousRoomCategoryId: string;

	public get pricePerPerson(): PricePerPersonDO {
		return this._pricePerPerson;
	}
	public set pricePerPerson(pricePerPerson: PricePerPersonDO) {
		this._pricePerPerson = pricePerPerson;
	}
	public get roomCategoryStats(): RoomCategoryStatsDO {
		return this._roomCategoryStats;
	}
	public set roomCategoryStats(roomCategoryStats: RoomCategoryStatsDO) {
		this._roomCategoryStats = roomCategoryStats;
	}
	public get previousRoomCategoryId(): string {
		return this._previousRoomCategoryId;
	}
	public set previousRoomCategoryId(previousRoomCategoryId: string) {
		this._previousRoomCategoryId = previousRoomCategoryId;
	}
}