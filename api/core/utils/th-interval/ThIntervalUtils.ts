import {IThInterval} from './IThInterval';
import {IThComparator} from '../th-comparator/IThComparator';
import {ThOrdering} from '../th-comparator/ThOrdering';

export abstract class ThIntervalUtils<T> {
	private _thOrdering: ThOrdering<T>;

	constructor(private _intervals: IThInterval<T>[], private _comparator: IThComparator<T>) {
		this._thOrdering = new ThOrdering<T>(_comparator);
	}

	public mergeIntervals() {
		this.sortByIntervalStart();
		this.mergeCommonIntervals();
	}
	private sortByIntervalStart() {
		this._intervals.sort((firstInterval: IThInterval<T>, secondInterval: IThInterval<T>) => {
			return this._comparator.compare(firstInterval.getStart(), secondInterval.getStart());
		});
	}
	private mergeCommonIntervals() {
		var containsOverlap = true;
		var mergedIntervalList: IThInterval<T>[];

		while (containsOverlap) {
			containsOverlap = false;
			mergedIntervalList = [];

			for (var index = 0; index < this._intervals.length; index++) {
				var interval: IThInterval<T> = this._intervals[index];

				if (this.hasNextIntervalFromIndex(index)) {
					var nextInterval: IThInterval<T> = this.getNextIntervalFromIndex(index);
					if (this._comparator.compare(interval.getEnd(), nextInterval.getStart()) >= 0 || this.areConsecutiveIntervals(interval, nextInterval)) {
						var mergedInterval = this.mergeIntoOneInterval(interval, nextInterval);
						mergedIntervalList.push(mergedInterval);
						containsOverlap = true;
						index++;
						continue;
					}
				}
				mergedIntervalList.push(interval);
			}
			this._intervals = mergedIntervalList;
		}
	}
	private hasNextIntervalFromIndex(index: number) {
		return index < this._intervals.length - 1;
	}
	private getNextIntervalFromIndex(index: number): IThInterval<T> {
		return this._intervals[index + 1];
	}
	private areConsecutiveIntervals(firstInterval: IThInterval<T>, secondInterval: IThInterval<T>) {
		var firstIntervalCopy = this.buildNewInterval(firstInterval.getStart(), firstInterval.getEnd());
		var firstIntervalEndNext = this.addOneUnitTo(firstIntervalCopy.getEnd());
		return this._comparator.compare(firstIntervalEndNext, secondInterval.getStart()) >= 0;
	}
	private mergeIntoOneInterval(firstInterval: IThInterval<T>, secondInterval: IThInterval<T>): IThInterval<T> {
		var intervalEnd = this._thOrdering.getMax(firstInterval.getEnd(), secondInterval.getEnd());
		var mergedInterval = this.buildNewInterval(firstInterval.getStart(), intervalEnd);
		return mergedInterval;
	}

	public addInterval(interval: IThInterval<T>) {
		this._intervals.push(interval);
		this.mergeIntervals();
	}

	public removeInterval(interval: IThInterval<T>) {
		this.sortByIntervalStart();
		this.removeIntervalCore(interval);
		this.mergeIntervals();
	}
	private removeIntervalCore(intervalToRemove: IThInterval<T>) {
		var updatedIntervalList: IThInterval<T>[] = [];
		this._intervals.forEach((interval: IThInterval<T>) => {
			updatedIntervalList = updatedIntervalList.concat(this.getIntervalDifference(interval, intervalToRemove));
		});
		this._intervals = updatedIntervalList;
	}
	private getIntervalDifference(interval: IThInterval<T>, intervalToRemove: IThInterval<T>): IThInterval<T>[] {
		if (this.intervalsDontIntersect(interval, intervalToRemove)) {
			return [interval];
		}
		if (this.firstIntervalIncludedInSecond(interval, intervalToRemove)) {
			return [];
		}
		if (this.firstIntervalIncludedInSecond(intervalToRemove, interval)) {
			return [
				this.buildNewInterval(interval.getStart(), this.substractOneUnitFrom(intervalToRemove.getStart())),
				this.buildNewInterval(this.addOneUnitTo(intervalToRemove.getEnd()), interval.getEnd())
			];
		}
		if (this._comparator.compare(interval.getStart(), intervalToRemove.getStart()) < 0) {
			return [
				this.buildNewInterval(interval.getStart(), this.substractOneUnitFrom(intervalToRemove.getStart()))
			];
		}
		if (this._comparator.compare(interval.getEnd(), intervalToRemove.getEnd()) > 0) {
			return [
				this.buildNewInterval(this.addOneUnitTo(intervalToRemove.getEnd()), interval.getEnd())
			];
		}
		return [];
	}
	private intervalsDontIntersect(firstInterval: IThInterval<T>, secondInterval: IThInterval<T>): boolean {
		return this._comparator.compare(firstInterval.getEnd(), secondInterval.getStart()) < 0 || this._comparator.compare(firstInterval.getStart(), secondInterval.getEnd()) > 0;
	}
	private firstIntervalIncludedInSecond(firstInterval: IThInterval<T>, secondInterval: IThInterval<T>): boolean {
		return this._comparator.compare(firstInterval.getStart(), secondInterval.getStart()) >= 0 && this._comparator.compare(firstInterval.getEnd(), secondInterval.getEnd()) <= 0;
	}

	protected abstract buildNewInterval(start: T, end: T): IThInterval<T>;
	protected abstract substractOneUnitFrom(intervalBoundary: T): T;
	protected abstract addOneUnitTo(intervalBoundary: T): T;

	public getProcessedIntervals(): IThInterval<T>[] {
		return this._intervals;
	}
}