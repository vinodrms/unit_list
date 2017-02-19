import { IHtmlToPdfConverterService, HtmlToPdfRequestDO, HtmlToPdfResponseDO } from './IHtmlToPdfConverterService';
import { ThUtils } from '../../utils/ThUtils';

export abstract class AHtmlToPdfConverterService implements IHtmlToPdfConverterService {
    protected _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public abstract generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO>;
}