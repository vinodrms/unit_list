import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThDateUtils} from '../../../common/data-objects/th-dates/ThDateUtils';
import {DocumentActionDO} from './DocumentActionDO';

export class DocumentHistoryDO extends BaseDO {
    actionList: DocumentActionDO[];

    constructor() {
        super();
        this.actionList = [];
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        var thDateUtils = new ThDateUtils();
        this.actionList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "actionList"), (actionObject: Object) => {
            var actionDO = new DocumentActionDO();
            actionDO.buildFromObject(actionObject);
            actionDO.thTimestampDO = thDateUtils.convertTimestampToThTimestamp(actionDO.timestamp);
            this.actionList.push(actionDO);
        });
    }

    public hasActionHistory(): boolean {
        return this.actionList.length > 0;
    }
    public getLastAction(): DocumentActionDO {
        return this.actionList[0];
    }
}