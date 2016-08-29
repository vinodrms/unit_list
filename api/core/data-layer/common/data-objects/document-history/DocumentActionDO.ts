import {BaseDO} from '../../base/BaseDO';

import _ = require('underscore');

export interface DocumentActionBuilderDO {
    actionString: string;
    actionParameterMap: Object;
    userId?: string;
    tag?: number;
}

export class DocumentActionDO extends BaseDO {
    public static SystemUserId = "System";

    actionString: string;
    actionParameterMap: Object = {};
    userId: string;
    timestamp: number;
    tag: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["actionString", "actionParameterMap", "userId", "timestamp", "tag"];
    }

    /* Omit the userId parameter if action is made from batch process */
    public static buildDocumentActionDO(builderDO: DocumentActionBuilderDO): DocumentActionDO {
        var documentAction = new DocumentActionDO();
        documentAction.actionString = builderDO.actionString;
        documentAction.actionParameterMap = builderDO.actionParameterMap;
        documentAction.userId = builderDO.userId;
        if (!_.isString(documentAction.userId)) {
            documentAction.userId = DocumentActionDO.SystemUserId;
        }
        documentAction.timestamp = (new Date()).getTime();
        documentAction.tag = builderDO.tag;
        return documentAction;
    }
}