import { Component, Input, Output, EventEmitter } from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {BedVM} from '../../../../../../services/beds/view-models/BedVM';

@Component({
    selector: 'bed-overview',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/beds/pages/bed-overview/template/bed-overview.html',
    pipes: [TranslationPipe]
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
}