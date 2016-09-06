import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../common/utils/AppContext';
import {AllotmentVM} from '../../../../../../services/allotments/view-models/AllotmentVM';
import {AllotmentConstraintMeta} from '../../../../../../services/allotments/data-objects/constraint/IAllotmentConstraint';
import {AllotmentConstraintDO} from '../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';
import {ISOWeekDayUtils, ISOWeekDayVM}  from '../../../../../../services/common/data-objects/th-dates/ISOWeekDay';

@Component({
	selector: 'allotment-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-overview/template/allotment-overview.html'
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

	constructor(private _appContext: AppContext) {
		super();
		var isoWeekDayUtils = new ISOWeekDayUtils();
		this.isoWeekDayVMList = isoWeekDayUtils.getISOWeekDayVMList();
	}
	public getConstraintDescription(constraint: AllotmentConstraintDO): string {
		if (this._allotmentVM.allotment.constraints.constraintList.length === 0) {
			return this._appContext.thTranslation.translate("No Constraints");
		}
		return this._appContext.thTranslation.translate(this.getConstraintTitle(constraint)) +
			": " + constraint.getValueDisplayString(this._appContext.thTranslation);
	}
	private getConstraintTitle(constraint: AllotmentConstraintDO): string {
		return this._allotmentVM.getConstraintMetaFor(constraint).title;
	}
}