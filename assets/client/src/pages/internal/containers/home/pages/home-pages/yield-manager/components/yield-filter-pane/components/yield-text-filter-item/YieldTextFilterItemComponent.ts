import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';

@Component({
	selector: 'yield-text-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-text-filter-item/template/yield-text-filter-item.html'
})
export class YieldTextFilterItemComponent implements OnInit {
	@Output() onSelect = new EventEmitter<YieldTextFilterItemComponent>();
	@Input() yieldTextFilterItemVM: TextFilterVM

	public selected: boolean;
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		this.selected = !this.selected;
		if (this.selected){
			this.onSelect.emit(this);
		}
	}

	public deselect(){
		this.selected = false;
	}	
}