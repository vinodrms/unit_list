import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThTrimPipe} from '../../../../../../../../../../common/utils/pipes/ThTrimPipe';
import {IAllotmentEditSection} from '../utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';
import {AllotmentAvailabilityDO} from '../../../../../../../../services/allotments/data-objects/availability/AllotmentAvailabilityDO';
import {ISOWeekDayUtils, ISOWeekDayVM, ISOWeekDay}  from '../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';

@Component({
	selector: 'allotment-availability-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/availability/template/allotment-availability-section.html',
	pipes: [TranslationPipe, ThTrimPipe]
})
export class AllotmentAvailabilitySectionComponent extends BaseComponent implements IAllotmentEditSection {
	@Input() didSubmit: boolean;
	readonly: boolean;

	allotmentAvailability: AllotmentAvailabilityDO;
	private _isoWeekDayVMList: ISOWeekDayVM[];

	constructor() {
		super();
		var isoWeekDayUtils = new ISOWeekDayUtils();
		this._isoWeekDayVMList = isoWeekDayUtils.getISOWeekDayVMList();
	}
	isValid(): boolean {
		return this.allotmentAvailability != null && this.allotmentAvailability.isValid();
	}
	initializeFrom(allotmentVM: AllotmentVM) {
		this.allotmentAvailability = allotmentVM.allotment.availability;
	}
	updateDataOn(allotmentVM: AllotmentVM) {
		allotmentVM.allotment.availability = this.allotmentAvailability;
	}

	public getISOWeekDayString(isoWeekDay: ISOWeekDay): string {
		return _.find(this._isoWeekDayVMList, (isoWeekDayVM: ISOWeekDayVM) => { return isoWeekDayVM.iSOWeekDay === isoWeekDay }).name;
	}
}