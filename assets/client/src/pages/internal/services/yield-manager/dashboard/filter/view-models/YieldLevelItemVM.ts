export interface YieldLevelItemVMParams {
	filterId: string;
	valueId: string;
	displayName: string;
	description: string;
	filterName: string;
}

export class YieldLevelItemVM {

	constructor(ygParams: YieldLevelItemVMParams) {
		this._filterId = ygParams.filterId;
		this._valueId = ygParams.valueId;
		this._displayName = ygParams.displayName;
		this._description = ygParams.description;
		this._filterName = ygParams.filterName;
	}

	private _filterId: string;
	public get filterId(): string {
		return this._filterId;
	}
	public set filterId(v: string) {
		this._filterId = v;
	}

	private _valueId: string;
	public get valueId(): string {
		return this._valueId;
	}
	public set valueId(v: string) {
		this._valueId = v;
	}


	private _displayName: string;
	public get displayName(): string {
		return this._displayName;
	}
	public set displayName(v: string) {
		this._displayName = v;
	}

	private _description: string;
	public get description(): string {
		return this._description;
	}
	public set description(v: string) {
		this._description = v;
	}


	private _filterName: string;
	public get filterName(): string {
		return this._filterName;
	}
	public set filterName(v: string) {
		this._filterName = v;
	}
}