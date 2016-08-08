import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {ColorFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';

@Component({
	selector: 'yield-color-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-color-filter-item/template/yield-color-filter-item.html'
})
export class YieldColorFitlerItemComponent implements OnInit {
	@Input() yieldColorFilterItemVM: ColorFilterVM;
	@Output() onSelect = new EventEmitter<YieldColorFitlerItemComponent>();
	
	public selected: boolean;
	constructor() { 
	}

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

	public getFilterNameClasses(){
		var classes = {};
		classes[this.yieldColorFilterItemVM.cssClass + '-color'] = this.selected;
		return classes;
	}

	public getRightClasses(){
		var classes = {};
		classes[this.yieldColorFilterItemVM.cssClass + '-alpha-1'] = this.selected;
		return classes;
	}
}