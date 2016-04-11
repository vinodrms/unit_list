import {YieldFilterValueDO} from '../../common/data-objects/yield-filter/YieldFilterValueDO';

export class YieldFilterValueVM {
	private _yieldFilterValue: YieldFilterValueDO;
	private _filterId: string;

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
}