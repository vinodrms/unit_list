import {BaseDO} from '../../../../../../common/base/BaseDO';

export class DocumentActionDO extends BaseDO {
    actionString: string;
    userId: string;
    timestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["actionString", "userId", "timestamp"];
    }
}