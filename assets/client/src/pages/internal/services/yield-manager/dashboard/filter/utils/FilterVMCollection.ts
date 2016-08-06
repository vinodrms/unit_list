export class FilterVMCollection<T> {
    private _filterVMList: T[];

    constructor() {
        this._filterVMList = [];
    }

    public get filterVMList(): T[] {
        return this._filterVMList;
    }
    public set filterVMList(filterVMList: T[]) {
        this._filterVMList = filterVMList;
    }
}