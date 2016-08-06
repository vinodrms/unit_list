import {IFilterVM} from './IFilterVM';
import {YieldFilterType} from '../../../../common/data-objects/yield-filter/YieldFilterDO';

export interface ColorFilterVMParams {
	filterId: string;
	valueId: string;
	colorName: string;
	cssClass: string;
	description: string;
	filterName: string;
}

export class ColorFilterVM implements IFilterVM {

	constructor(ygParams: ColorFilterVMParams) {
		this._filterType = YieldFilterType.Color;
		this._filterId = ygParams.filterId;
		this._valueId = ygParams.valueId;
		this._colorName = ygParams.colorName;
		this._cssClass = ygParams.cssClass;
		this._description = ygParams.description;
		this._filterName = ygParams.filterName;
	}

	private _filterType: YieldFilterType;
	public get filterType(): YieldFilterType {
		return this._filterType;
	}
	public set filterType(filterType: YieldFilterType) {
		this._filterType = filterType;
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


	private _colorName: string;
	public get colorName(): string {
		return this._colorName;
	}
	public set colorName(v: string) {
		this._colorName = v;
	}


	private _cssClass: string;
	public get cssClass(): string {
		return this._cssClass;
	}
	public set cssClass(v: string) {
		this._cssClass = v;
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