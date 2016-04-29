import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {IPriceProductEditSection} from '../../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogRef} from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {PriceProductConstraintModalService} from '../constraint-modal/services/PriceProductConstraintModalService';
import {PriceProductConstraintDO} from '../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';
import {PriceProductConstraintWrapperDO} from '../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintWrapperDO';
import {PriceProductConstraintContainer} from './utils/PriceProductConstraintContainer';
import {PriceProductConstraintVM} from './utils/PriceProductConstraintVM';

@Component({
	selector: 'price-product-edit-constraints-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/constraints/constraints-list/template/price-product-edit-constraints-section.html',
	providers: [PriceProductConstraintModalService],
	pipes: [TranslationPipe]
})
export class PriceProductEditConstraintsSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	constraintContainer: PriceProductConstraintContainer;

	constructor(private _appContext: AppContext,
		private _constraintsModal: PriceProductConstraintModalService) {
		super();
		this.constraintContainer = new PriceProductConstraintContainer(this._appContext.thTranslation);
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		var constraintList: PriceProductConstraintDO[] = [];
		if (priceProductVM.priceProduct.constraints) {
			var ppConstraintList = priceProductVM.priceProduct.constraints.constraintList;
			if (ppConstraintList && ppConstraintList.length > 0) {
				constraintList = constraintList.concat(ppConstraintList);
			}
		}
		this.constraintContainer.initFromConstraintList(constraintList);
	}
	public getConstraintValue(constraintDO: PriceProductConstraintDO): string {
		return constraintDO.getValueDisplayString(this._appContext.thTranslation);
	}

	public updateDataOn(priceProductVM: PriceProductVM) {
		if (!priceProductVM.priceProduct.constraints) {
			priceProductVM.priceProduct.constraints = new PriceProductConstraintWrapperDO();
		}
		priceProductVM.priceProduct.constraints.constraintList = this.constraintContainer.getConstraintDOList();
	}

	public removeConstraint(constraintVM: PriceProductConstraintVM) {
		this.constraintContainer.removeConstraint(constraintVM);
	}
	public openConstraintsModal() {
		this._constraintsModal.openPriceProductConstraintsModal()
			.then((modalDialogInstance: ModalDialogRef<PriceProductConstraintDO>) => {
				modalDialogInstance.resultObservable.subscribe((addedConstraint: PriceProductConstraintDO) => {
					this.constraintContainer.addConstraint(addedConstraint);
				})
			}).catch((e: any) => { });
	}
}