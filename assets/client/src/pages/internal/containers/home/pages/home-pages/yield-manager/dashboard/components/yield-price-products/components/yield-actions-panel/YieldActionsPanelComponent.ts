import {Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {ThDateDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {AppContext} from '../../../../../../../../../../../../common/utils/AppContext';

import {TranslationPipe} from '../../../../../../../../../../../../common/utils/localization/TranslationPipe'

import {PriceProductYieldAction} from '../../../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

import {ThDateIntervalDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDatePickerComponent} from '../../../../../../../../../../../../common/utils/components/ThDatePickerComponent';

import {PriceProductYieldParam} from '../../../../../../../../../../services/yield-manager/dashboard/common/PriceProductYieldParam';

export interface IActionPaneYieldParams {
	action: PriceProductYieldAction,
	forever: boolean,
	interval: ThDateIntervalDO
}

@Component({
	selector: 'yield-actions-panel',
	templateUrl: 'client/src/pages/internal/containers/home/pages/home-pages/yield-manager/dashboard/components/yield-price-products/components/yield-actions-panel/template/yield-actions-panel.html'
})
export class YieldActionsPanelComponent implements OnInit {
	@Input() isYielding: boolean = false;
	@Output() onApplyAction = new EventEmitter<IActionPaneYieldParams>();
	private referenceDate: ThDateDO;
	private forever: boolean;
	private actionDateInterval: ThDateIntervalDO;
	private selectedAction: string;
	private noAction = "-1"
	private enums;

	constructor(
		private _appContext: AppContext
	) {
		// TODO: get correct reference date
		var referenceDate = ThDateDO.buildThDateDO(2016, 7, 1);
		this.forever = false;
		this.actionDateInterval = new ThDateIntervalDO();
		this.actionDateInterval.start = referenceDate;
		this.actionDateInterval.end = this.actionDateInterval.start.buildPrototype();
		this.enums = {
			PriceProductYieldAction: PriceProductYieldAction
		}
		this.selectedAction = this.noAction;
	}

	ngOnInit() { }

	public didSelectOpenInterval(event) {
		alert("did select open interval");
	}

	public didSelectActionStartDate(startDate: ThDateDO) {
		this.actionDateInterval.start = startDate;
		if (this.actionDateInterval.start.isAfter(this.actionDateInterval.end)) {
			this.actionDateInterval.end = this.actionDateInterval.start.buildPrototype();
		}
	}

	public didSelectActionEndDate(endDate: ThDateDO) {
		this.actionDateInterval.end = endDate;
	}

	private hasValidParams(){
		if (this.selectedAction == this.noAction){
			this._appContext.toaster.error('No action was selected');
			return false;
		}
		return true;
	}

	public applyChanges() {
		if (this.hasValidParams()){
			var yieldParams : IActionPaneYieldParams = {
				action: parseInt(this.selectedAction),
				forever: this.forever,
				interval: this.actionDateInterval
			};
			this.onApplyAction.emit(yieldParams);
		}
	}

	public getFilterStatInfoLabel(){
		return "Showing 4/20";
	}
}