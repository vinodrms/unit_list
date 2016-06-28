import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {IAllotmentEditSection} from '../utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDateUtils} from '../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';

@Component({
	selector: 'allotment-open-interval-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/open-interval/template/allotment-open-interval-section.html',
	directives: [ThDateIntervalPickerComponent]
})
export class AllotmentOpenIntervalSectionComponent extends BaseComponent implements IAllotmentEditSection {
	@Input() didSubmit: boolean;
	readonly: boolean;

	private _thDateUtils = new ThDateUtils();

	dateInterval: ThDateIntervalDO;
	minDate: ThDateDO;

	constructor() {
		super();
		this.dateInterval = this._thDateUtils.getTodayToTomorrowInterval();
		this.minDate = this._thDateUtils.getTodayThDayeDO();
	}
	isValid(): boolean {
		return this.dateInterval && this.dateInterval.isValid();
	}
	initializeFrom(allotmentVM: AllotmentVM) {
		if (!allotmentVM.allotment.openInterval) {
			this.dateInterval = this._thDateUtils.getTodayToTomorrowInterval();
			return;
		}
		this.dateInterval = allotmentVM.allotment.openInterval;
	}
	updateDataOn(allotmentVM: AllotmentVM) {
		allotmentVM.allotment.openInterval = this.dateInterval;
	}

	public didSelectOpenInterval(openInterval: ThDateIntervalDO) {
		this.dateInterval = openInterval;
	}
}