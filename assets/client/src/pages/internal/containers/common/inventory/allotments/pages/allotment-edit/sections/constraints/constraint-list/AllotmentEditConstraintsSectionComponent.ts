import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {IAllotmentEditSection} from '../../utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../../services/allotments/view-models/AllotmentVM';
import {AllotmentConstraintContainer} from './utils/AllotmentConstraintContainer';
import {AllotmentConstraintVM} from './utils/AllotmentConstraintVM';
import {AllotmentConstraintDO} from '../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';
import {AllotmentConstraintWrapperDO} from '../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintWrapperDO';
import {AllotmentConstraintModalService} from '../constraint-modal/services/AllotmentConstraintModalService';

@Component({
	selector: 'allotment-edit-constraints-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/constraints/constraint-list/template/allotment-edit-constraints-section.html',
	providers: [AllotmentConstraintModalService],
	pipes: [TranslationPipe]
})
export class AllotmentEditConstraintsSectionComponent extends BaseComponent implements IAllotmentEditSection {
	@Input() didSubmit: boolean;
	readonly: boolean;

	constraintContainer: AllotmentConstraintContainer;

	constructor(private _appContext: AppContext,
		private _constraintsModal: AllotmentConstraintModalService) {
		super();
		this.constraintContainer = new AllotmentConstraintContainer(this._appContext.thTranslation);
	}
	isValid(): boolean {
		return true;
	}
	initializeFrom(allotmentVM: AllotmentVM) {
		var constraintList: AllotmentConstraintDO[] = [];
		if (allotmentVM.allotment.constraints) {
			var allConstraintList = allotmentVM.allotment.constraints.constraintList;
			if (allConstraintList && allConstraintList.length > 0) {
				constraintList = constraintList.concat(allConstraintList);
			}
		}
		this.constraintContainer.initFromConstraintList(constraintList);
	}
	updateDataOn(allotmentVM: AllotmentVM) {
		if (!allotmentVM.allotment.constraints) {
			allotmentVM.allotment.constraints = new AllotmentConstraintWrapperDO();
		}
		allotmentVM.allotment.constraints.constraintList = this.constraintContainer.getConstraintDOList();
	}

	public removeConstraint(constraintVM: AllotmentConstraintVM) {
		this.constraintContainer.removeConstraint(constraintVM);
	}
	public openConstraintsModal() {
		this._constraintsModal.openAllotmentConstraintsModal()
			.then((modalDialogInstance: ModalDialogRef<AllotmentConstraintDO>) => {
				modalDialogInstance.resultObservable.subscribe((addedConstraint: AllotmentConstraintDO) => {
					this.constraintContainer.addConstraint(addedConstraint);
				})
			}).catch((e: any) => { });
	}
}