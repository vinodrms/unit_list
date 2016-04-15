import {RoomCategoriesType} from '../../../../../../../services/room-categories/RoomCategoriesService';
import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';

export class BedsModalInput {
	private _bedVMList: BedVM[];
	
	public get bedVMList(): BedVM[] {
		return this._bedVMList;
	}
	public set bedVMList(bedVMList: BedVM[]) {
		this._bedVMList = bedVMList;
	}
}