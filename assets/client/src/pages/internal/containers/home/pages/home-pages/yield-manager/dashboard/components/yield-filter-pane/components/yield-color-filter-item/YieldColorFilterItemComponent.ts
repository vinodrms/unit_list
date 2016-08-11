import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {ColorFilterVM}  from '../../../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';

import {AYieldFilterItemComponent} from '../common/AYieldFilterItemComponent'; 

@Component({
	selector: 'yield-color-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-filter-pane/components/yield-color-filter-item/template/yield-color-filter-item.html'
})
export class YieldColorFitlerItemComponent extends AYieldFilterItemComponent implements OnInit {
	@Input() yieldColorFilterItemVM: ColorFilterVM;
	@Output() onSelect = new EventEmitter<YieldColorFitlerItemComponent>();

	public triggerOnSelectEvent(){
		this.onSelect.emit(this);
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