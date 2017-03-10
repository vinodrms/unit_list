import { Component } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../../common/base/BaseComponent';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { ICustomModalComponent, ModalSize } from '../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import { ModalDialogRef } from '../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { PriceProductConstraintDO } from '../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';

@Component({
	selector: 'price-product-constraint-modal',
	templateUrl: "/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/constraints/constraint-modal/template/price-product-constraint-modal.html"
})
export class PriceProductConstraintModalComponent extends BaseComponent implements ICustomModalComponent {
	constraintDO: PriceProductConstraintDO;

	constructor(private _appContext: AppContext,
		private _modalDialogRef: ModalDialogRef<PriceProductConstraintDO>) {
		super();
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

	public didSelectConstraint(selectedConstraint: PriceProductConstraintDO) {
		this.constraintDO = selectedConstraint;
	}

	public addConstraint() {
		if (!this.constraintDO.isValid()) {
			return;
		}
		this._modalDialogRef.addResult(this.constraintDO);
		this.closeDialog();
	}
}