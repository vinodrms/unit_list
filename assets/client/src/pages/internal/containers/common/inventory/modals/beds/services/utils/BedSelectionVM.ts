import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';

export class BedSelectionVM {
	private _bedVM: BedVM;
    private _numberOfInstances: number;
	
	constructor() {
    }
	
	public get bedVM(): BedVM {
        return this._bedVM;
    }
    public set bedVM(bedVM: BedVM) {
        this._bedVM = bedVM;
    }
	
	public get numberOfInstances(): number {
        return this._numberOfInstances;
    }
    public set numberOfInstances(numberOfInstances: number) {
        this._numberOfInstances = numberOfInstances;
    }		
}