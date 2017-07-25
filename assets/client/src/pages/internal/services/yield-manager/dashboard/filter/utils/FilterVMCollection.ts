import {IFilterVM} from '../view-models/IFilterVM';

import * as _ from "underscore";

export class FilterVMCollection<T extends IFilterVM> {
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

    public getFilterVM(filterId: string, valueId: string): T {
        return _.find(this._filterVMList, (filterVM: T) => {
            return filterVM.filterId === filterId && filterVM.valueId === valueId;
        });
    }
}