import { Component, OnInit, Input} from '@angular/core';

import {ColorFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/ColorFilterVM';

@Component({
	selector: 'yield-group-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-group-item/template/yield-group-item.html'
})
export class YieldGroupItemComponent implements OnInit {
	@Input() yieldGroupItemVM: ColorFilterVM;
	public selected: boolean;
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		this.selected = !this.selected;
	}
}