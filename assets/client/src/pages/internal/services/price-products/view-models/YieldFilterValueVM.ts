import {YieldFilterType} from '../../common/data-objects/yield-filter/YieldFilterDO';
import {YieldFilterValueDO} from '../../common/data-objects/yield-filter/YieldFilterValueDO';
import {PriceProductYieldFilterMetaDO} from '../data-objects/yield-filter/PriceProductYieldFilterDO';
import {YieldFiltersDO} from '../../hotel-configurations/data-objects/YieldFiltersDO';
import {YieldFilterDO} from '../../common/data-objects/yield-filter/YieldFilterDO';

import * as _ from "underscore";

export class YieldFilterValueVM {
	private _yieldFilterValue: YieldFilterValueDO;
	private _filterId: string;
	private _type: YieldFilterType;
	private _label: string;

	public get yieldFilterValue(): YieldFilterValueDO {
		return this._yieldFilterValue;
	}
	public set yieldFilterValue(yieldFilterValue: YieldFilterValueDO) {
		this._yieldFilterValue = yieldFilterValue;
	}
	public get filterId(): string {
		return this._filterId;
	}
	public set filterId(filterId: string) {
		this._filterId = filterId;
	}
	public get type(): YieldFilterType {
		return this._type;
	}
	public set type(type: YieldFilterType) {
		this._type = type;
	}
	public get label(): string {
		return this._label;
	}
	public set label(label: string) {
		this._label = label;
	}
	public isText(): boolean {
		return this._type === YieldFilterType.Text;
	}
	public isColor(): boolean {
		return this._type === YieldFilterType.Color;
	}
	public hasValue(): boolean {
		return this._yieldFilterValue != null;
	}
	
	public static buildYieldFilterValueVMList(yieldFilters: YieldFiltersDO, priceProductYieldFilterMetaList: PriceProductYieldFilterMetaDO[]): YieldFilterValueVM[] {
		if(!priceProductYieldFilterMetaList) {
			return [];
		}
		var yieldFilterVMValues: YieldFilterValueVM[] = [];
		_.forEach(yieldFilters.yieldFilterList, (yieldFilter: YieldFilterDO) => {
			var foundFilter: PriceProductYieldFilterMetaDO = _.find(priceProductYieldFilterMetaList, (filter: PriceProductYieldFilterMetaDO) => {
				return filter.filterId === yieldFilter.id;
			});
			var filterValueVM = new YieldFilterValueVM();
			filterValueVM.filterId = yieldFilter.id;
			filterValueVM.type = yieldFilter.type;
			filterValueVM.label = yieldFilter.label;

			if (!foundFilter) {
				yieldFilterVMValues.push(filterValueVM);
				return;
			}
			var foundFilterValue: YieldFilterValueDO = _.find(yieldFilter.values, (filterValue: YieldFilterValueDO) => {
				return filterValue.id === foundFilter.valueId;
			});
			if (!foundFilterValue) {
				yieldFilterVMValues.push(filterValueVM);
				return;
			}
			filterValueVM.yieldFilterValue = foundFilterValue;
			yieldFilterVMValues.push(filterValueVM);
		});
		return yieldFilterVMValues;
	}
}