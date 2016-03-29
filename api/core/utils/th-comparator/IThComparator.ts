export interface IThComparator<T> {
	compare(firstItem: T, secondItem: T): number;
}