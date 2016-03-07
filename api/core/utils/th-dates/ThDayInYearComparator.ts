import {ThDayInYearDO} from './data-objects/ThDayInYearDO';
import {IThComparator} from '../th-comparator/IThComparator';

export class ThDayInYearComparator implements IThComparator<ThDayInYearDO> {
	public compare(firstItem: ThDayInYearDO, secondItem: ThDayInYearDO): number {
		var monthCompareResult = this.compareNumbers(firstItem.month, secondItem.month);
		return monthCompareResult !== 0 ? monthCompareResult : this.compareNumbers(firstItem.day, secondItem.day);
	}
	private compareNumbers(firstNumber: number, secondNumber: number): number {
		if (firstNumber < secondNumber) {
			return -1;
		}
		if (firstNumber > secondNumber) {
			return 1;
		}
		return 0;
	}
}