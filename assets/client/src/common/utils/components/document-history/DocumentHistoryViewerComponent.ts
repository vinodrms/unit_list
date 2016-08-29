import {Component, OnInit, Input} from '@angular/core';
import {AppContext} from '../../../utils/AppContext';
import {TranslationPipe} from '../../localization/TranslationPipe';
import {ThTimestampPipe} from '../../pipes/ThTimestampPipe';
import {DocumentHistoryDO} from '../../../../pages/internal/services/common/data-objects/document-history/DocumentHistoryDO';
import {DocumentActionDO} from '../../../../pages/internal/services/common/data-objects/document-history/DocumentActionDO';

@Component({
    selector: 'document-history-viewer',
    templateUrl: '/client/src/common/utils/components/document-history/template/document-history-viewer.html',
    pipes: [TranslationPipe, ThTimestampPipe]
})
export class DocumentHistoryViewerComponent {
    private static DefaultNoOfActions = 3;
    didExpand: boolean;

    private _documentHistory: DocumentHistoryDO;
    public get documentHistory(): DocumentHistoryDO {
        return this._documentHistory;
    }
    @Input()
    public set documentHistory(documentHistory: DocumentHistoryDO) {
        this._documentHistory = documentHistory;
        this.filterLessActions();
    }

    private _filteredActionList: DocumentActionDO[];

    constructor(private _appContext: AppContext) {
        this.didExpand = false;
    }

    public get didInit(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this.documentHistory);
    }

    private filterLessActions() {
        this._filteredActionList = this.allActionList.slice(0, Math.min(DocumentHistoryViewerComponent.DefaultNoOfActions, this._documentHistory.actionList.length));
    }
    public get allActionList(): DocumentActionDO[] {
        return this.documentHistory.actionList;
    }

    public get canShowExpandButton(): boolean {
        return this.allActionList.length > DocumentHistoryViewerComponent.DefaultNoOfActions && !this.didExpand;
    }

    public showAllActions() {
        this.didExpand = true;
        this._filteredActionList = this.allActionList;
    }
    public showLessActions() {
        this.didExpand = false;
        this.filterLessActions();
    }

    public get filteredActionList(): DocumentActionDO[] {
        return this._filteredActionList;
    }
    public set filteredActionList(filteredActionList: DocumentActionDO[]) {
        this._filteredActionList = filteredActionList;

    }
}