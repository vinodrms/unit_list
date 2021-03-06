import { AppContext } from '../../../../../utils/AppContext';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { AReportOutputWriter } from '../AReportOutputWriter';
import { ReportGroup } from '../../result/ReportGroup';
import { ReportSection } from '../../result/ReportSection';
import { ReportFileResult } from '../../result/ReportFileResult';
import { ThUtils } from '../../../../../utils/ThUtils';

let endOfLine = require('os').EOL;

export class CsvReportOutputWriter extends AReportOutputWriter {
    private static Separator = ",";
    private static CsvMetadata = "sep=" + CsvReportOutputWriter.Separator;
    private static OutputFolder = "output/reports/report/"
    private _utils: ThUtils;

    constructor(private _appContext: AppContext) {
        super();
        this._utils = new ThUtils();
    }
    protected saveToFileCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }, group: ReportGroup) {
        let csvString = this.getReportCSVString(group);
        let fileService = this._appContext.getServiceFactory().getFileService();
        let fileName = group.meta.name + "_" + this._utils.generateShortId();
        fileService.createFile(CsvReportOutputWriter.OutputFolder, fileName, 'csv', csvString).then((fullFilePath: string) => {
            resolve({
                reportPath: fullFilePath,
                reportGroup: group
            });
        }).catch((e) => {
            reject(e);
        });
    }

    private getReportCSVString(group: ReportGroup): string {
        let csvString = "";
        csvString += this.getSeparatorMetadata();
        group.sectionList.forEach((item: ReportSection) => {
            let rcsv = this.buildCSVStringForReportItem(item);
            csvString += rcsv + endOfLine + endOfLine;
        });
        return csvString;
    }
    private getSeparatorMetadata() {
         return CsvReportOutputWriter.CsvMetadata + endOfLine;
    }
    private buildCSVStringForReportItem(item: ReportSection) {
        let rCSV = "";
        if (item.header.display) {
            rCSV += this.buildCSVRowForArray(item.header.values); + endOfLine;
        }
        item.data.forEach(row => {
            rCSV += this.buildCSVRowForArray(row);
        });
        return rCSV;
    }

    private buildCSVRowForArray(data: any[]) {
        let rowCSV = "";
        for (let i = 0; i < data.length - 1; i++) {
            rowCSV += this.transformValue(data[i]) + CsvReportOutputWriter.Separator;
        }
        rowCSV += this.transformValue(data[data.length - 1]) + endOfLine;
        return rowCSV;
    }

    private transformValue(data): string {
        if (this._utils.isUndefinedOrNull(data)) {
            return "";
        }
        var dataString: string = String(data);
        if (dataString && dataString.includes('"')) {
            dataString = dataString.replace(/"/g, '""');
        }
        return '"' + dataString + '"';
    }
}