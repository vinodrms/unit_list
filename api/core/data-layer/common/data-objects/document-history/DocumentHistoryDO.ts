import {BaseDO} from '../../base/BaseDO';
import {DocumentActionDO} from './DocumentActionDO';

export class DocumentHistoryDO extends BaseDO {
    public static MAX_HISTORY_SIZE: number = 50;

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

    public logDocumentAction(documentAction: DocumentActionDO) {
        this.actionList.unshift(documentAction);
        this.actionList = this.actionList.slice(0, Math.min(this.actionList.length, DocumentHistoryDO.MAX_HISTORY_SIZE));
    }
}