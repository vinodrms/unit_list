import {IHtmlToPdfConverterService, HtmlToPdfRequestDO, HtmlToPdfResponseDO} from './IHtmlToPdfConverterService';
import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';

export abstract class AHtmlToPdfConverterService implements IHtmlToPdfConverterService {
    constructor() {
    }

    public abstract generatePdf(htmlToPdfReq: HtmlToPdfRequestDO): Promise<HtmlToPdfResponseDO>;
}