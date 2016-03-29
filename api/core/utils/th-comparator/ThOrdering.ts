import {IThComparator} from './IThComparator';

export class ThOrdering<T> {
	constructor(private _comparator: IThComparator<T>) {
	}
	public getMax(firstItem: T, secondItem: T): T {
		var compareResult = this._comparator.compare(firstItem, secondItem);
		if (compareResult < 0) {
			return secondItem;
		}
		return firstItem;
	}
}