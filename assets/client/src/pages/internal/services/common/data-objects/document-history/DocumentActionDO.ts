import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateUtils} from '../../../common/data-objects/th-dates/ThDateUtils';
import {ThTimestampDO} from '../../../common/data-objects/th-dates/ThTimestampDO';

export class DocumentActionDO extends BaseDO {
    private _thTimestampDO: ThTimestampDO;
    actionString: string;
    userId: string;
    timestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["actionString", "userId", "timestamp"];
    }

    public get thTimestampDO(): ThTimestampDO {
        return this._thTimestampDO;
    }
    public set thTimestampDO(thTimestampDO: ThTimestampDO) {
        this._thTimestampDO = thTimestampDO;
    }
}