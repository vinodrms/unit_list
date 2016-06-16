import {AllotmentDO} from '../../../../data-layer/allotments/data-objects/AllotmentDO';

import _ = require('underscore');

export class AllotmentsContainer {
    private _allotmentList: AllotmentDO[];

    constructor(allotmentList: AllotmentDO[]) {
        this._allotmentList = allotmentList;
    }

    public get allotmentList(): AllotmentDO[] {
        return this._allotmentList;
    }
    public set allotmentList(allotmentList: AllotmentDO[]) {
        this._allotmentList = allotmentList;
    }

    public getAllotmentById(allotmentId: string): AllotmentDO {
        return _.find(this._allotmentList, (allotment: AllotmentDO) => {
            return allotment.id === allotmentId;
        });
    }
}