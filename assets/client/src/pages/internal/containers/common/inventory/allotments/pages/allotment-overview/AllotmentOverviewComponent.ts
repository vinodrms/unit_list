import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {ThDateIntervalPipe} from '../../../../../../../../common/utils/pipes/ThDateIntervalPipe';
import {ThTrimPipe} from '../../../../../../../../common/utils/pipes/ThTrimPipe';
import {AllotmentVM} from '../../../../../../services/allotments/view-models/AllotmentVM';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';
import {ISOWeekDayUtils, ISOWeekDayVM}  from '../../../../../../services/common/data-objects/th-dates/ISOWeekDay';

@Component({
	selector: 'allotment-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-overview/template/allotment-overview.html',
	pipes: [TranslationPipe, ThDateIntervalPipe, ThTrimPipe],
	directives: [CustomScroll]
})
export class AllotmentOverviewComponent extends BaseComponent {
	private _allotmentVM: AllotmentVM;
	public get allotmentVM(): AllotmentVM {
		return this._allotmentVM;
	}
	@Input()
	public set allotmentVM(allotmentVM: AllotmentVM) {
		this._allotmentVM = allotmentVM;
	}

	@Output() onEdit = new EventEmitter();
	public editAllotment() {
		this.onEdit.next(this._allotmentVM);
	}

	@Output() onArchive = new EventEmitter();
	public archiveAllotment() {
		this.onArchive.next(this._allotmentVM);
	}
	isoWeekDayVMList: ISOWeekDayVM[];

	constructor() {
		super();
		var isoWeekDayUtils = new ISOWeekDayUtils();
		this.isoWeekDayVMList = isoWeekDayUtils.getISOWeekDayVMList();
	}
}