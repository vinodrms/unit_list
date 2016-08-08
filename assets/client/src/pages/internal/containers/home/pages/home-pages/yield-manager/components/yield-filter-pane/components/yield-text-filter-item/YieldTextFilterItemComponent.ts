import { Component, OnInit, Input } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';

@Component({
	selector: 'yield-text-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/components/yield-filter-pane/components/yield-text-filter-item/template/yield-text-filter-item.html'
})
export class YieldTextFilterItemComponent implements OnInit {
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