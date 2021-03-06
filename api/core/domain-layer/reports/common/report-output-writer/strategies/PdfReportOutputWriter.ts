import { AppContext } from '../../../../../utils/AppContext';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { AReportOutputWriter } from '../AReportOutputWriter';
import { ReportGroup } from '../../result/ReportGroup';
import { ReportSection, ReportSectionMeta, ReportSectionHeader } from '../../result/ReportSection';
import { ReportFileResult } from '../../result/ReportFileResult';
import { ReportType, PdfReportsServiceResponse } from '../../../../../services/pdf-reports/IPdfReportsService';
import { PageOrientation } from '../../../../../services/pdf-reports/PageOrientation';

import _ = require('underscore');

export class PdfReportOutputWriter extends AReportOutputWriter {
    private static MaxNoColumnsPerRow_Portrait = 10;
    private static MaxNoColumnsPerRow_Landscape = 14;

    constructor(private _appContext: AppContext) {
        super();
    }

    protected saveToFileCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }, group: ReportGroup) {
        let splitReportGroup = this.getReportGroupWithSplitSections(group);
        let pdfReportsService = this._appContext.getServiceFactory().getPdfReportsService();
        pdfReportsService.generatePdfReport({
            reportType: ReportType.Report,
            reportData: splitReportGroup,
            settings: {},
            pageOrientation: group.meta.pageOrientation
        }).then((pdfResponse: PdfReportsServiceResponse) => {
            resolve({
                reportPath: pdfResponse.pdfPath,
                reportGroup: group
            })
        }).catch((e) => {
            reject(e);
        })
    }

    // the sections could have many columns that cannot fit in the same table row
    private getReportGroupWithSplitSections(inGroup: ReportGroup): ReportGroup {
        let splitGroup = new ReportGroup(inGroup.meta, inGroup.summary);
        _.forEach(inGroup.sectionList, (inSection: ReportSection) => {
            let splitSectionList = this.getSplitSections(inGroup, inSection);
            splitGroup.sectionList = splitGroup.sectionList.concat(splitSectionList);
        });
        return splitGroup;
    }
    // splits each section into multiple sections with max MaxNoColumnsPerRow rows each
    private getSplitSections(inGroup: ReportGroup, inSection: ReportSection): ReportSection[] {
        let noColumns = inSection.getNoColumns();
        let maxNoColumnsPerRow = this.getMaxNoColumnsPerRow(inGroup);
        if (noColumns <= maxNoColumnsPerRow) {
            return [inSection];
        }
        var splitSectionList: ReportSection[] = [];
        var part = 1;
        for (var i = 0; i < noColumns; i += maxNoColumnsPerRow) {
            var title = this._appContext.thTranslate.translate("Part %partNo%", { partNo: part });
            if (_.isString(inSection.meta.title)) {
                title = inSection.meta.title + " - " + title;
            }
            let sectionMeta: ReportSectionMeta = {
                title: title
            };

            let sectionHeader: ReportSectionHeader = { display: inSection.header.display };
            if (_.isArray(inSection.header.values)) {
                sectionHeader.values = inSection.header.values.slice(i, i + maxNoColumnsPerRow);
            }

            var data: any[][] = [];
            _.forEach(inSection.data, (rowData: any[]) => {
                let subRowData = rowData.slice(i, i + maxNoColumnsPerRow);
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
    private getMaxNoColumnsPerRow(group: ReportGroup): number {
        if (group.meta.pageOrientation === PageOrientation​​.Landscape) {
            return PdfReportOutputWriter.MaxNoColumnsPerRow_Landscape;
        }
        return PdfReportOutputWriter.MaxNoColumnsPerRow_Portrait;
    }
}