import { Component, OnInit, Input} from '@angular/core';

import {ColorFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';

@Component({
	selector: 'yield-color-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-color-filter-item/template/yield-color-filter-item.html'
})
export class YieldColorFitlerItemComponent implements OnInit {
	@Input() yieldColorFilterItemVM: ColorFilterVM;
	public selected: boolean;
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		this.selected = !this.selected;
	}
}