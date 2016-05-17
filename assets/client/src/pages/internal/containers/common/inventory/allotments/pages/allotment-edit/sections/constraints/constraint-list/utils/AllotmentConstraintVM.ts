import {AllotmentConstraintDO} from '../../../../../../../../../../services/allotments/data-objects/constraint/AllotmentConstraintDO';

export class AllotmentConstraintVM {
	private _constraintDO: AllotmentConstraintDO;
	private _index: number;
	private _displayTitle: string;
	private _displayValue: string;

	public get constraintDO(): AllotmentConstraintDO {
		return this._constraintDO;
	}
	public set constraintDO(constraintDO: AllotmentConstraintDO) {
		this._constraintDO = constraintDO;
	}
	public get index(): number {
		return this._index;
	}
	public set index(index: number) {
		this._index = index;
	}
	public get displayTitle(): string {
		return this._displayTitle;
	}
	public set displayTitle(displayTitle: string) {
		this._displayTitle = displayTitle;
	}
	public get displayValue(): string {
		return this._displayValue;
	}
	public set displayValue(displayValue: string) {
		this._displayValue = displayValue;
	}
}