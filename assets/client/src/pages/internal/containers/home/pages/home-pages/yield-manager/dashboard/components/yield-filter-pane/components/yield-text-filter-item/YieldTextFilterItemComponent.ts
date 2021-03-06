import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TextFilterVM}  from '../../../../../../../../../../services/yield-manager/dashboard/filter/view-models/TextFilterVM';
import {AYieldFilterItemComponent} from '../common/AYieldFilterItemComponent'; 

@Component({
	selector: 'yield-text-filter-item',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-filter-pane/components/yield-text-filter-item/template/yield-text-filter-item.html'
})
export class YieldTextFilterItemComponent extends AYieldFilterItemComponent implements OnInit {
	@Output() onToggleSelection = new EventEmitter<{filterItemComponent :YieldTextFilterItemComponent, selected: boolean}>();
	@Input() yieldTextFilterItemVM: TextFilterVM

	public triggerOnToggleSelectionEvent(selected: boolean){
		this.onToggleSelection.emit({ filterItemComponent: this, selected : selected });
	}
}