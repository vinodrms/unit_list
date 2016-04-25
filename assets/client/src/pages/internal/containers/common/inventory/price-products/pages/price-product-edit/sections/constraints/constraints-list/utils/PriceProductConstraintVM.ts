import {PriceProductConstraintDO} from '../../../../../../../../../../services/price-products/data-objects/constraint/PriceProductConstraintDO';

export class PriceProductConstraintVM {
	private _constraintDO: PriceProductConstraintDO;
	private _index: number;
	private _displayTitle: string;
	private _displayValue: string;

	public get constraintDO(): PriceProductConstraintDO {
		return this._constraintDO;
	}
	public set constraintDO(constraintDO: PriceProductConstraintDO) {
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