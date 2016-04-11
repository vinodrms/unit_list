import {BaseDO} from '../../../../../../common/base/BaseDO';

export interface YieldFilterValue {
    id: string;
    description: string;
    colorCode?: string;
    label?: string;
}

export class YieldFilterValueDO extends BaseDO implements YieldFilterValue {
    id: string;
    description: string;
    colorCode: string;
    label: string;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ['id', 'description', 'colorCode', 'label'];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}