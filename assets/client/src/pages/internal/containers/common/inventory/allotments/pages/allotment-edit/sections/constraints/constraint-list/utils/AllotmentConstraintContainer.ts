import {ThTranslation} from '../../../../../../../../../../../../common/utils/localization/ThTranslation';
import {AllotmentConstraintFactory} from '../../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintFactory';
import {AllotmentConstraintMeta} from '../../../../../../../../../../services/allotments/data-objects/constraint/IAllotmentConstraint';
import {AllotmentConstraintDO} from '../../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';
import {AllotmentConstraintVM} from './AllotmentConstraintVM';

export class AllotmentConstraintContainer {
	private _constraintMetaList: AllotmentConstraintMeta[];
	private _currentIndex: number;
	private _constraintVMList: AllotmentConstraintVM[];

	constructor(private _thTranslation: ThTranslation) {
		var constraintFactory = new AllotmentConstraintFactory();
		this._constraintMetaList = constraintFactory.getAllotmentConstraintMetaList();
	}

	public initFromConstraintList(constraintDOList: AllotmentConstraintDO[]) {
		this._currentIndex = 0;
		this._constraintVMList = [];
		_.forEach(constraintDOList, (constraintDO: AllotmentConstraintDO) => {
			this.addConstraint(constraintDO);
		});
	}
	public addConstraint(constraintDO: AllotmentConstraintDO) {
		var constraintVM = new AllotmentConstraintVM();
		constraintVM.constraintDO = constraintDO;
		constraintVM.displayTitle = this.getConstraintTitle(constraintDO);
		constraintVM.displayValue = constraintDO.getValueDisplayString(this._thTranslation);
		constraintVM.index = this._currentIndex++;
		this._constraintVMList.push(constraintVM);
	}
	private getConstraintTitle(constraintDO: AllotmentConstraintDO): string {
		return _.find(this._constraintMetaList, (constraintMeta: AllotmentConstraintMeta) => { return constraintMeta.constraintType === constraintDO.type }).title;
	}

	public removeConstraint(constraintVM: AllotmentConstraintVM) {
		this._constraintVMList = _.filter(this._constraintVMList, (existingConstraintVM: AllotmentConstraintVM) => { return existingConstraintVM.index !== constraintVM.index });
	}

	public get constraintVMList(): AllotmentConstraintVM[] {
		return this._constraintVMList;
	}
	public set constraintVMList(constraintVMList: AllotmentConstraintVM[]) {
		this._constraintVMList = constraintVMList;
	}

	public getConstraintDOList(): AllotmentConstraintDO[] {
		return _.map(this._constraintVMList, (constraintVM: AllotmentConstraintVM) => {
			return constraintVM.constraintDO;
		});
	}
}