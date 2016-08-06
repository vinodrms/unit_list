import { Component, OnInit, Input } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';

@Component({
	selector: 'yield-level-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-level-item/template/yield-level-item.html'
})
export class YieldLevelItemComponent implements OnInit {
	@Input() yieldLevelItemVM: TextFilterVM
	public selected: boolean;
	constructor() { }

	ngOnInit() {
		this.selected = false;
	}

	public toggleSelection() {
		this.selected = !this.selected;
	}
}