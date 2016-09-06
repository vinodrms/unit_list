import { Component, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';
import {BedAccommodationType} from '../../../../../../services/beds/data-objects/BedDO';

@Component({
    selector: 'bed-overview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/beds/pages/bed-overview/template/bed-overview.html'
})
export class BedOverviewComponent extends BaseComponent {
    constructor() { 
        super();
    }

    private _bedVM: BedVM;
	public get bedVM(): BedVM {
		return this._bedVM;
	}
    
	@Input()
	public set bedVM(bedVM: BedVM) {
		this._bedVM = bedVM;
	}
    
    @Output() onEdit = new EventEmitter();
	public editBed() {
		this.onEdit.next(this._bedVM);
	}
	
	public get accommodatesBabies(): boolean {
		return this._bedVM.bed.accommodationType === BedAccommodationType.Babies;
	}
}