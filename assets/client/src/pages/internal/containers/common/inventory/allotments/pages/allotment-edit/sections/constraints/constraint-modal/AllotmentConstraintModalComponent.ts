import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { ThError, AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { ISOWeekDayUtils, ISOWeekDayVM } from '../../../../../../../../../services/common/data-objects/th-dates/ISOWeekDay';
import { AllotmentConstraintDO } from '../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';
import { IAllotmentConstraint, AllotmentConstraintMeta, AllotmentConstraintType } from '../../../../../../../../../services/allotments/data-objects/constraint/IAllotmentConstraint';
import { AllotmentConstraintFactory } from '../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintFactory';

import * as _ from "underscore";

@Component({
	selector: 'allotment-constraint-modal',
	templateUrl: "/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/constraints/constraint-modal/template/allotment-constraint-modal.html"
})
export class AllotmentConstraintModalComponent extends BaseComponent implements ICustomModalComponent {
	private _constraintFactory: AllotmentConstraintFactory;

	isoWeekDayVMList: ISOWeekDayVM[];
	constraintDO: AllotmentConstraintDO;
	constraintMetaList: AllotmentConstraintMeta[];

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<AllotmentConstraintDO>) {
		super();
		this._constraintFactory = new AllotmentConstraintFactory();
		this.constraintMetaList = this._constraintFactory.getAllotmentConstraintMetaList();
		this.constraintDO = this._constraintFactory.getDefaultConstraintDO();
		this.isoWeekDayVMList = (new ISOWeekDayUtils()).getISOWeekDayVMList();
	}

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Medium;
	}
	public get description(): string {
		return _.find(this.constraintMetaList, (constraintMeta: AllotmentConstraintMeta) => { return constraintMeta.constraintType === this.constraintDO.type }).description;
	}
	public didChangeConstraintType(newConstraintTypeStr: string) {
		var newConstraintType: AllotmentConstraintType = parseInt(newConstraintTypeStr);
		if (newConstraintType === this.constraintDO.type) {
			return;
		}
		this.constraintDO = this._constraintFactory.getConstraintDOByType(newConstraintType);
	}

	public isDaysFromWeekConstraint() {
		return this.constraintDO.type === AllotmentConstraintType.BookableOnlyOnDaysFromWeek || this.constraintDO.type === AllotmentConstraintType.IncludeDaysFromWeek;
	}
	public isReleaseTimeInDaysConstraint() {
		return this.constraintDO.type === AllotmentConstraintType.ReleaseTimeInDays;
	}

	public addConstraint() {
		if (!this.constraintDO.isValid()) {
			return;
		}
		this._modalDialogRef.addResult(this.constraintDO);
		this.closeDialog();
	}
}