import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateUtils} from '../../../common/data-objects/th-dates/ThDateUtils';
import {ThTimestampDO} from '../../../common/data-objects/th-dates/ThTimestampDO';

export class DocumentActionDO extends BaseDO {
    actionString: string;
    userId: string;
    timestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["actionString", "userId", "timestamp"];
    }

    public getThTimestampDO(): ThTimestampDO {
        return (new ThDateUtils()).convertTimestampToThTimestamp(this.timestamp);
    }
}