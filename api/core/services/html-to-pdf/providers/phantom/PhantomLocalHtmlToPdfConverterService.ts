import { AHtmlToPdfConverterService } from '../../AHtmlToPdfConverterService';
import { HtmlToPdfRequestDO, HtmlToPdfResponseDO } from '../../IHtmlToPdfConverterService';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { ThUtils } from '../../../../utils/ThUtils';
import { PageOrientation } from '../../../pdf-reports/PageOrientation';

import phantom = require('phantom');
import _ = require('underscore');
var ejs = require('ejs');

export class PhantomLocalHtmlToPdfConverterService extends AHtmlToPdfConverterService {
    private static PAPER_OPTIONS = {
        format: 'A4',
        margin: {
            top: '30px',
            bottom: '10px',
            left: '10px',
            right: '10px'
        }  
    };
    private static VIEWPORT_SIZE = {
        width: 1920,
        height: 1080
    };
    private static DPI = 130;

    private _htmlToPdfReq: HtmlToPdfRequestDO;

    public generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO> {
        this._htmlToPdfReq = htmlToPdfReq;

        return new Promise<HtmlToPdfResponseDO>((resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }) => {
            this.generatePdfCore(resolve, reject);
        });
    }

    private generatePdfCore(resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }) {
        var _page: any;
        var _ph: phantom.PhantomJS;

        var pdfPath = this._htmlToPdfReq.pdfReportOutputPath;
        var htmlUrl = this._htmlToPdfReq.htmlUrl;

        var resourceWait = 3000,
            maxRenderWait = 10000,
            renderTimeout = null,
            forcedRenderTimeout = null,
            phInstance = null,
            sitepage = null;

        phantom.create().then(function (instance) {
            phInstance = instance;
            return instance.createPage();
        }).then((page) => {
            sitepage = page;
            sitepage.on('onResourceRequested', ((request) => {
                clearTimeout(renderTimeout);
            }));

            var paperOptions = this.getPaperOptions();
            paperOptions["footer"] = {
                height: "30px",
                contents: phInstance.callback((pageNum, numPages) => {
                return "<span style=\"font-size: 9px; width: 100%; text-align: center; font-family: sans-serif; color: #555;\"><div style=\"margin: auto;\">" + pageNum + " / " + numPages + "</div></span>";
        })
        }
            return sitepage.property('paperSize', paperOptions);
        }).then(() => {
            return sitepage.property('viewportSize', PhantomLocalHtmlToPdfConverterService.VIEWPORT_SIZE);
        }).then(() => {
            return sitepage.property('dpi', PhantomLocalHtmlToPdfConverterService.DPI);
        }).then(function () {
            return sitepage.open(htmlUrl);
        }).then(status => {
            if (status !== "success") {
                phInstance.exit();
            } else {
                forcedRenderTimeout = setTimeout(() => {
                    clearTimeout(renderTimeout);
                    sitepage.render(pdfPath).then(() => {
                        sitepage.close();
                        phInstance.exit();
                        resolve({ filePath: pdfPath });
                    });
                }, maxRenderWait);
            }
        }).catch((err) => {
            var thError = new ThError(ThStatusCode.PhantomHtmlToPdfConverter, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "error converting html to pdf with phantom js", this._htmlToPdfReq, thError);
            phInstance.exit();
        });
    }

    private getPaperOptions(): Object {
        let options: any = _.clone(PhantomLocalHtmlToPdfConverterService.PAPER_OPTIONS);
        options.orientation = 'portrait';
        if (this._htmlToPdfReq.pageOrientation === PageOrientation.Landscape) {
            options.orientation = 'landscape';
        }
        return options;
    }
}