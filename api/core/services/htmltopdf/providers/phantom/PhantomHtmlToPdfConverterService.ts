import {AHtmlToPdfConverterService} from '../../AHtmlToPdfConverterService';
import {HtmlToPdfRequestDO, HtmlToPdfResponseDO} from '../../IHtmlToPdfConverterService';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../../utils/ThUtils';

import phantom = require('phantom');

export class PhantomHtmlToPdfConverterService extends AHtmlToPdfConverterService {
    private static PAPER_SIZE = {
        format: 'A4',
        orientation: 'portrait'
    };
    private static VIEWPORT_SIZE = {
        width: 1920,
        height: 1080
    };
    private static DPI = 130;

    public generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO> {
        return new Promise<HtmlToPdfResponseDO>((resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }) => {
            this.generatePdfCore(resolve, reject, htmlToPdfReq);
        });
    }

    private generatePdfCore(resolve: { (result: HtmlToPdfResponseDO): void }, reject: { (err: ThError): void }, htmlToPdfReq: HtmlToPdfRequestDO) {
        var _page: any;
        var _ph: phantom.PhantomJS;
        
        phantom.create(['--ignore-ssl-errors=yes']).then((ph: phantom.PhantomJS) => {
            _ph = ph;
            return _ph.createPage();
        }).then((page: any) => {
            _page = page;

            _page.on('onResourceReceived', ((response) => {
                console.log('onResourceReceived');
                // check if the resource is done downloading 
                if (response.stage !== "end") return;

                if (response.headers.filter(((header) => {
                    if (header.name == 'Content-Type' && header.value.indexOf('text/html') == 0) {
                        return true;
                    }
                    return false;
                })).length > 0) {
                    console.log('onResourceReceived status: ' + response.status);
                    if (response.status == "200") {
                        console.log('before rendering');
                        _page.render(htmlToPdfReq.outputPath).then(() => {
                            console.log('after rendering: ' + htmlToPdfReq.outputPath);
                            _page.close();
                            _ph.exit();

                            resolve({ filePath: htmlToPdfReq.outputPath });
                        });
                    }
                    else {
                        var thError = new ThError(ThStatusCode.PhantomHtmlToPdfHtmlReportPageAccessError, null);
                        ThLogger.getInstance().logError(ThLogLevel.Error, "Error accessing the html report page. HTTP Status: " + response.status, { htmlToPdfReq: htmlToPdfReq }, thError);
                        reject(thError);
                    }
                }
            }));
            
            return _page.property('customHeaders', { Cookie: this.getCookieStringFromReq(htmlToPdfReq) });
        }).then(() => {
            return _page.property('paperSize', PhantomHtmlToPdfConverterService.PAPER_SIZE);
        }).then(() => {
            return _page.property('viewportSize', PhantomHtmlToPdfConverterService.VIEWPORT_SIZE);
        }).then(() => {
            return _page.property('dpi', PhantomHtmlToPdfConverterService.DPI);
        }).then(() => {
            console.log('before opening the page: ' + htmlToPdfReq.htmlUrl);
            return _page.open(htmlToPdfReq.htmlUrl);
        }).catch((err: Error) => {
            var thError = new ThError(ThStatusCode.PhantomHtmlToPdfGenerationError, err);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Error generating pdf", { htmlToPdfReq: htmlToPdfReq }, thError);
            reject(thError);
        });
    }
    
    private getCookieStringFromReq(req: HtmlToPdfRequestDO): string {
        var cookieStr = '';
        if(!this._thUtils.isUndefinedOrNull(req.settings)) {
            cookieStr = req.settings["cookie"];    
        }
        return cookieStr;
    }
}