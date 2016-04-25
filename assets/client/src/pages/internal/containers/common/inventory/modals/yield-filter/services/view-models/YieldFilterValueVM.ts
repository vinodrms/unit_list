import {YieldFilterValueDO} from '../../../../../../../services/common/data-objects/yield-filter/YieldFilterValueDO';
import {ColorMeta} from '../../../../../../../services/common/data-objects/yield-filter/ColorFilter';

export class YieldFilterValueVM {
	private _filterValue: YieldFilterValueDO;
	private _filterId: string;
	private _isEditing: boolean;
	private _isSaving: boolean;
	private _colorMeta: ColorMeta;

	constructor(filterValue: YieldFilterValueDO, filterId: string, colorMeta: ColorMeta) {
		this._filterId = filterId;
		this._filterValue = new YieldFilterValueDO();
		this._filterValue.buildFromObject(filterValue);
		this._isEditing = false;
		this._isSaving = false;
		this._colorMeta = colorMeta;
	}

	public get filterValue(): YieldFilterValueDO {
		return this._filterValue;
	}
	public set filterValue(filterValue: YieldFilterValueDO) {
		this._filterValue = filterValue;
	}
	public get filterId(): string {
		return this._filterId;
	}
	public set filterId(filterId: string) {
		this._filterId = filterId;
	}
	public get isEditing(): boolean {
		return this._isEditing;
	}
	public set isEditing(isEditing: boolean) {
		this._isEditing = isEditing;
	}
	public get isSaving(): boolean {
		return this._isSaving;
	}
	public set isSaving(isSaving: boolean) {
		this._isSaving = isSaving;
	}
	public get colorMeta(): ColorMeta {
		return this._colorMeta;
	}
	public set colorMeta(colorMeta: ColorMeta) {
		this._colorMeta = colorMeta;
	}
}