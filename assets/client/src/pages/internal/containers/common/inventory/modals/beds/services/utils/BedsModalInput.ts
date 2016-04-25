import {RoomCategoriesType} from '../../../../../../../services/room-categories/RoomCategoriesService';
import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';

export class BedsModalInput {
	private _availableBedVMList: BedVM[];
	private _selectedBedVMList: BedVM[];
	private _maxNoOfBeds: number;
	private _minNoOfBeds: number;
	
	public get availableBedVMList(): BedVM[] {
		return this._availableBedVMList;
	}
	public set availableBedVMList(availableBedVMList: BedVM[]) {
		this._availableBedVMList = availableBedVMList;
	}
	public get selectedBedVMList(): BedVM[] {
		return this._selectedBedVMList;
	}
	public set selectedBedVMList(selectedBedVMList: BedVM[]) {
		this._selectedBedVMList = selectedBedVMList;
	}
	public get maxNoOfBeds(): number {
		return this._maxNoOfBeds;
	}
	public set maxNoOfBeds(maxNoOfBeds: number) {
		this._maxNoOfBeds = maxNoOfBeds;
	}
	
	public get minNoOfBeds(): number {
		return this._minNoOfBeds;
	}
	public set minNoOfBeds(minNoOfBeds: number) {
		this._minNoOfBeds = minNoOfBeds;
	}
}