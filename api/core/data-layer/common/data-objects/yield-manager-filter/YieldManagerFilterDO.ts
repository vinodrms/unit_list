import {BaseDO} from '../../../common/base/BaseDO';
import {YieldManagerFilterValueDO} from './YieldManagerFilterValueDO';

export enum YieldManagerFilterType {
    Text,
    Color
};

export class YieldManagerFilterDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    type: YieldManagerFilterType;
    label: string;
    values: YieldManagerFilterValueDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "label"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.values = [];
        this.forEachElementOf(object["values"], (yieldManagerFilterValueDO: Object) => {
            var filterValueDO = new YieldManagerFilterValueDO();
            filterValueDO.buildFromObject(yieldManagerFilterValueDO);
            this.values.push(filterValueDO);
        });
    }
}