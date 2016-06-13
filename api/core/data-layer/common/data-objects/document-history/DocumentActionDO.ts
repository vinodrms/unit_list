import {BaseDO} from '../../base/BaseDO';

export interface DocumentActionBuilderDO {
    actionString: string;
    actionParameterMap: Object;
    userId: string;
}

export class DocumentActionDO extends BaseDO {
    actionString: string;
    actionParameterMap: Object = {};
    userId: string;
    timestamp: number;

    protected getPrimitivePropertyKeys(): string[] {
        return ["actionString", "actionParameterMap", "timestamp", "userId"];
    }

    public static buildDocumentActionDO(builderDO: DocumentActionBuilderDO): DocumentActionDO {
        var documentAction = new DocumentActionDO();
        documentAction.actionString = builderDO.actionString;
        documentAction.actionParameterMap = builderDO.actionParameterMap;
        documentAction.userId = builderDO.userId;
        documentAction.timestamp = (new Date()).getTime();
        return documentAction;
    }
}