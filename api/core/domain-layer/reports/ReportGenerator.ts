import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';
import { ThError } from '../../utils/th-responses/ThError';
import { ThUtils } from '../../utils/ThUtils';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { ValidationResultParser } from '../common/ValidationResultParser';
import { ReportGeneratorDO } from './ReportGeneratorDO';
import { ReportGeneratorFactory } from './common/report-generator/ReportGeneratorFactory';
import { ReportGroup } from './common/result/ReportGroup';
import { ReportFileResult } from './common/result/ReportFileResult';
import { ReportOutputWriterFactory } from './common/report-output-writer/ReportOutputWriterFactory';

export class ReportGenerator {
    private _generatorDO: ReportGeneratorDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getReport(reportParams: ReportGeneratorDO): Promise<ReportFileResult> {
        this._generatorDO = reportParams;
        return new Promise<ReportFileResult>((resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }) => {
            this.getReportCore(resolve, reject);
        });
    }

    private getReportCore(resolve: { (result: ReportFileResult): void }, reject: { (err: ThError): void }) {
        var validationResult = ReportGeneratorDO.getValidationStructure().validateStructure(this._generatorDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._generatorDO);
            parser.logAndReject("Error validating data for get report", reject);
            return;
        }
        let factory = new ReportGeneratorFactory(this._appContext, this._sessionContext);
        let strategy = factory.getGeneratorStrategy(this._generatorDO.reportType);
        strategy.generate(this._generatorDO.properties).then((reportGroup: ReportGroup) => {
            let outputWriterFactory = new ReportOutputWriterFactory(this._appContext);
            let outputWriter = outputWriterFactory.getOutputWriter(this._generatorDO.format);
            return outputWriter.saveToFile(reportGroup);
        }).then((result: ReportFileResult) => {
            resolve(result);
        }).catch((e) => {
            reject(e);
        });
    }
}