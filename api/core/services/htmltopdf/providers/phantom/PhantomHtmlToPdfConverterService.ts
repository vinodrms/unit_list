import {AHtmlToPdfConverterService} from '../../AHtmlToPdfConverterService';
import {HtmlToPdfRequestDO, HtmlToPdfResponseDO} from '../../IHtmlToPdfConverterService';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../../utils/ThUtils';

import phantom = require('phantom');

export class PhantomHtmlToPdfConverterService extends AHtmlToPdfConverterService {
    public generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO> {
        return new Promise<HtmlToPdfResponseDO>((resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }) => {
            this.generatePdfCore(resolve, reject, htmlToPdfReq);
        });
    }

    private generatePdfCore(resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }, htmlToPdfReq: HtmlToPdfRequestDO) {
        var _page: phantom.WebPage;
        var _ph: phantom.PhantomJS;

        phantom.create(['--ignore-ssl-errors=yes']).then((ph: phantom.PhantomJS) => {
            _ph = ph;
            return _ph.createPage();
        }).then((page: phantom.WebPage) => {
            _page = page;
            return _page.property('paperSize', { format: 'A4', orientation: 'portrait' })
        }).then(() => {
            return _page.property('viewportSize', { width: 1920, height: 1080 });
        }).then(() => {
            return _page.property('dpi', 130)
        }).then(() => {
            return _page.open(htmlToPdfReq.htmlUrl);
        }).then(status => {
            return _page.render(htmlToPdfReq.pdfFileName);
        }).then(() => {
            _page.close();
            _ph.exit();

            resolve({ filePath: htmlToPdfReq.pdfFileName });
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.PhantomHtmlToPdfGenerationError, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error generating pdf", { htmlToPdfReq: htmlToPdfReq }, thError);
            reject(thError);
        });
    }
}