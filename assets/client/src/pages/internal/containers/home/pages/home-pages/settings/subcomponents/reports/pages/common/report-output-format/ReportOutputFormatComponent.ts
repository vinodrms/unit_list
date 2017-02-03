import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReportOutputFormatType, ReportOutputFormat } from '../../../utils/ReportOutputFormatType';

@Component({
    selector: 'report-output-format',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/reports/pages/common/report-output-format/template/report-output-format.html'
})
export class ReportOutputFormatComponent implements OnInit {
    private formatList: ReportOutputFormat[];
    private _selectedFormatType: ReportOutputFormatType;

    @Output() protected onFormatSelected = new EventEmitter<ReportOutputFormatType>();
    protected triggerOnFormatSelected(type: ReportOutputFormatType) {
        this.onFormatSelected.next(type);
    }

    constructor() {
        this.formatList = ReportOutputFormat.getPossibleValues();
    }

    ngOnInit() {
        this.selectedFormatType = this.formatList[0].type;
    }

    public didSelectFormat(formatTypeString: string) {
        this.selectedFormatType = parseInt(formatTypeString);
    }

    public get selectedFormatType(): ReportOutputFormatType {
        return this._selectedFormatType;
    }
    public set selectedFormatType(selectedFormatType: ReportOutputFormatType) {
        this._selectedFormatType = selectedFormatType;
        this.triggerOnFormatSelected(this._selectedFormatType);
    }
}