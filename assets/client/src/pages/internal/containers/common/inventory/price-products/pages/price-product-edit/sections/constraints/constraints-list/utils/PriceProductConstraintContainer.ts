import { AppContext } from "../../../../../../../../../../../../common/utils/AppContext";
import { PriceProductConstraintFactory } from '../../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintFactory';
import { PriceProductConstraintMeta } from '../../../../../../../../../../services/price-products/data-objects/constraint/IPriceProductConstraint';
import { PriceProductConstraintDO } from '../../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';
import { PriceProductConstraintVM } from './PriceProductConstraintVM';

import * as _ from "underscore";

export class PriceProductConstraintContainer {
	private _constraintMetaList: PriceProductConstraintMeta[];
	private _currentIndex: number;
	private _constraintVMList: PriceProductConstraintVM[];

	constructor(private _appContext: AppContext) {
		var constraintFactory = new PriceProductConstraintFactory();
		this._constraintMetaList = constraintFactory.getPriceProductConstraintMetaList();
	}

	public initFromConstraintList(constraintDOList: PriceProductConstraintDO[]) {
		this._currentIndex = 0;
		this._constraintVMList = [];
		_.forEach(constraintDOList, (constraintDO: PriceProductConstraintDO) => {
			this.addConstraint(constraintDO);
		});
	}
	public addConstraint(constraintDO: PriceProductConstraintDO) {
		var constraintVM = new PriceProductConstraintVM();
		constraintVM.constraintDO = constraintDO;
		constraintVM.displayTitle = this.getConstraintTitle(constraintDO);
		constraintVM.displayValue = constraintDO.getValueDisplayString(this._appContext.thTranslation);
		constraintVM.index = this._currentIndex++;
		this._constraintVMList.push(constraintVM);
	}
	private getConstraintTitle(constraintDO: PriceProductConstraintDO): string {
		return _.find(this._constraintMetaList, (constraintMeta: PriceProductConstraintMeta) => { return constraintMeta.constraintType === constraintDO.type }).title;
	}

	public removeConstraint(constraintVM: PriceProductConstraintVM) {
		let title = this._appContext.thTranslation.translate("Remove Constraint");
		var content = this._appContext.thTranslation.translate("Are you sure you want to remove the %constraintName% constraint?", { constraintName: constraintVM.displayTitle });
		this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
			() => {
				this.removeConstraintCore(constraintVM);
			}, () => { });
	}
	private removeConstraintCore(constraintVM: PriceProductConstraintVM) {
		this._constraintVMList = _.filter(this._constraintVMList, (existingConstraintVM: PriceProductConstraintVM) => { return existingConstraintVM.index !== constraintVM.index });
	}

	public get constraintVMList(): PriceProductConstraintVM[] {
		return this._constraintVMList;
	}
	public set constraintVMList(constraintVMList: PriceProductConstraintVM[]) {
		this._constraintVMList = constraintVMList;
	}

	public getConstraintDOList(): PriceProductConstraintDO[] {
		return _.map(this._constraintVMList, (constraintVM: PriceProductConstraintVM) => {
			return constraintVM.constraintDO;
		});
	}

	public isEmpty(): boolean {
		return !_.isArray(this._constraintVMList) || this._constraintVMList.length == 0;
	}
}