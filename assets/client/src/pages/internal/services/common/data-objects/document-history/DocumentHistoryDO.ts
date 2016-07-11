import {BaseDO} from '../../../../../../common/base/BaseDO';
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

        this.actionList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "actionList"), (actionObject: Object) => {
            var actionDO = new DocumentActionDO();
            actionDO.buildFromObject(actionObject);
            this.actionList.push(actionDO);
        });
    }
}