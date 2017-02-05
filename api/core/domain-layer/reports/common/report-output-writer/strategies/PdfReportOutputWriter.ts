import { AppContext } from '../../../../../utils/AppContext';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { AReportOutputWriter } from '../AReportOutputWriter';
import { ReportGroup } from '../../result/ReportGroup';
import { ReportSection, ReportSectionMeta, ReportSectionHeader } from '../../result/ReportSection';
import { ReportFileResult } from '../../result/ReportFileResult';
import { ReportType, PdfReportsServiceResponse } from '../../../../../services/pdf-reports/IPdfReportsService';

import _ = require('underscore');

export class PdfReportOutputWriter extends AReportOutputWriter {
    public static MaxNoColumnsPerRow = 10;

    constructor(private _appContext: AppContext) {
        super();
    }

    protected saveToFileCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }, group: ReportGroup) {
        let splitReportGroup = this.getReportGroupWithSplitSections(group);
        let pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        pdfReportsService.generatePdfReport({
            reportType: ReportType.Report,
            reportData: splitReportGroup,
            settings: {}
        }).then((pdfResponse: PdfReportsServiceResponse) => {
            resolve({
                reportPath: pdfResponse.pdfPath
            })
        }).catch((e) => {
            reject(e);
        })
    }

    // the sections could have many columns that cannot fit in the same table row
    private getReportGroupWithSplitSections(inGroup: ReportGroup): ReportGroup {
        let splitGroup = new ReportGroup(inGroup.meta);
        _.forEach(inGroup.sectionList, (inSection: ReportSection) => {
            let splitSectionList = this.getSplitSections(inSection);
            splitGroup.sectionList = splitGroup.sectionList.concat(splitSectionList);
        });
        return splitGroup;
    }
    // splits each section into multiple sections with max MaxNoColumnsPerRow rows each
    private getSplitSections(inSection: ReportSection): ReportSection[] {
        let noColumns = inSection.getNoColumns();
        if (noColumns <= PdfReportOutputWriter.MaxNoColumnsPerRow) {
            return [inSection];
        }
        var splitSectionList: ReportSection[] = [];
        var part = 1;
        for (var i = 0; i < noColumns; i += PdfReportOutputWriter.MaxNoColumnsPerRow) {
            var title = this._appContext.thTranslate.translate("Part %partNo%", { partNo: part });
            if (_.isString(inSection.meta.title)) {
                title = inSection.meta.title + " - " + title;
            }
            let sectionMeta: ReportSectionMeta = {
                title: title
            };

            let sectionHeader: ReportSectionHeader = { display: inSection.header.display };
            if (_.isArray(inSection.header.values)) {
                sectionHeader.values = inSection.header.values.slice(i, i + PdfReportOutputWriter.MaxNoColumnsPerRow);
            }

            var data: any[][] = [];
            _.forEach(inSection.data, (rowData: any[]) => {
                let subRowData = rowData.slice(i, i + PdfReportOutputWriter.MaxNoColumnsPerRow);
                data.push(subRowData);
            });

            let section = new ReportSection();
            section.header = sectionHeader;
            section.meta = sectionMeta;
            section.data = data;

            splitSectionList.push(section);
            part++;
        }
        return splitSectionList;
    }
}