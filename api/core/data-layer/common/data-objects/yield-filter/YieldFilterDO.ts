import {BaseDO} from '../../../common/base/BaseDO';
import {YieldFilterValueDO} from './YieldFilterValueDO';

export enum YieldFilterType {
    Text,
    Color
};

export class YieldFilterDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    type: YieldFilterType;
    label: string;
    values: YieldFilterValueDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "label"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.values = [];
        this.forEachElementOf(object["values"], (yieldFilterValueDO: Object) => {
            var filterValueDO = new YieldFilterValueDO();
            filterValueDO.buildFromObject(yieldFilterValueDO);
            this.values.push(filterValueDO);
        });
    }
}