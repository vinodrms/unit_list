import {BaseDO} from '../../base/BaseDO';
import {DocumentActionDO} from './DocumentActionDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';

import _ = require('underscore');

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

    public translateActions(thTranslation: ThTranslation) {
        _.forEach(this.actionList, (action: DocumentActionDO) => {
            action.actionString = thTranslation.translate(action.actionString, action.actionParameterMap);
        });
    }
}