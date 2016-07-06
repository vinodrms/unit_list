import {ReportType, PdfReportsServiceRequest, PdfReportsServiceResponse} from '../IPdfReportsService';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {APdfReportsService} from '../APdfReportsService';
import {IPdfReportConfig} from './config/IPdfReportConfig';
import {PdfReportConfigFactory} from './config/PdfReportConfigFactory';
import {HtmlToPdfResponseDO} from '../../html-to-pdf/IHtmlToPdfConverterService';

var ejs = require('ejs');
var mkdirp = require('mkdirp');
import fs = require('fs');
import path = require('path');
import url = require('url');

export class PdfReportsService extends APdfReportsService {

    private _reportsServiceRequest: PdfReportsServiceRequest;
    private _reportConfig: IPdfReportConfig;

    public generatePdfReport(reportsServiceRequest: PdfReportsServiceRequest): Promise<PdfReportsServiceResponse> {
        this._reportsServiceRequest = reportsServiceRequest;

        return new Promise<PdfReportsServiceResponse>((resolve: { (reportsServiceResponse?: PdfReportsServiceResponse): void },
            reject: { (err: ThError): void }) => {
            this.generatePdfReportCore(resolve, reject);
        });
    }

    public generatePdfReportCore(resolve: { (response?: PdfReportsServiceResponse): void },
        reject: { (err: ThError): void }) {
        this._reportConfig = PdfReportConfigFactory.getPdfReportConfig(this._reportsServiceRequest.reportType, this._unitPalConfig);

        this.generateHtml().then((generatedHtmlPath: string) => {
            return this._htmlToPdfConverterService.generatePdf({
                htmlUrl: this.getFileUrlFromFileRelativePath(generatedHtmlPath),
                pdfReportOutputPath: this._reportConfig.getOutputPdfAbsolutePath(this._reportsServiceRequest.reportData),
                settings: this._reportsServiceRequest.settings
            });
        }).then((converterRespone: HtmlToPdfResponseDO) => {
            resolve({ pdfPath: converterRespone.filePath });
        }).catch((err: any) => {
            var thError = new ThError(ThStatusCode.PdfReportServiceHtmlToPdfError, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error generating pdf from html file", this._reportsServiceRequest, thError);
            reject(err);
        });
    }

    private generateHtml(): Promise<string> {
        return new Promise<string>((resolve: { (generatedHtmlPath: string): void }, reject: { (err: ThError): void }) => {
            this.generateHtmlCore(resolve, reject);
        });
    }

    private generateHtmlCore(resolve: { (generatedHtmlPath: string): void }, reject: { (err: ThError): void }) {

        ejs.renderFile(this._reportConfig.getHtmlTemplateUrl(), this._reportsServiceRequest.reportData, {}, (err, str) => {
            var htmlOutputPath = this._reportConfig.getOutputHtmlAbsolutePath(this._reportsServiceRequest.reportData);
            var htmlOutputDir = path.parse(htmlOutputPath).dir;

            var writeHtmlStringToFile = (outputPath: string, htmlStr: string) => {
                fs.writeFile(outputPath, htmlStr, (err) => {
                    if (err) {
                        var thError = new ThError(ThStatusCode.PdfReportServiceErrorWritingHtmlToFile, err);
                        ThLogger.getInstance().logError(ThLogLevel.Error, "error writing html file on disk", { outputPath: outputPath }, thError);
                        reject(thError);
                    }
                    resolve(outputPath);
                });
            }

            fs.exists(htmlOutputDir, (exists) => {
                if (!exists) {
                    mkdirp(htmlOutputDir, (err) => {
                        if (err) {
                            var thError = new ThError(ThStatusCode.PdfReportServiceErrorCreatingOutputFolder, err);
                            ThLogger.getInstance().logError(ThLogLevel.Error, "error creating output folder", { htmlOutputDir: htmlOutputDir }, thError);
                            reject(thError);
                        }
                        else {
                            writeHtmlStringToFile(htmlOutputPath, str);
                        }
                    });
                }
                else {
                    writeHtmlStringToFile(htmlOutputPath, str);
                }
            });
        });
    }

    private getFileUrlFromFileRelativePath(relativePath: string): string {
        var absPath = path.resolve(relativePath);
        var normalizedAbsPath = path.normalize(absPath);
        var posixAbsPath = normalizedAbsPath.replace(/\\/gi, "/");

        return url.format({
            protocol: 'file:',
            slashes: true,
            pathname: posixAbsPath
        });
    }
}