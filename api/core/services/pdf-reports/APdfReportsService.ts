import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {IPdfReportsService, ReportType, PdfReportsServiceRequest, PdfReportsServiceResponse} from './IPdfReportsService';
import {IHtmlToPdfConverterService} from '../html-to-pdf/IHtmlToPdfConverterService';

export abstract class APdfReportsService implements IPdfReportsService{
    
    constructor(protected _unitPalConfig: UnitPalConfig, protected _htmlToPdfConverterService: IHtmlToPdfConverterService) {
           
    }
    
    public abstract generatePdfReport(htmlReportsServiceRequest: PdfReportsServiceRequest): Promise<PdfReportsServiceResponse>;  
}