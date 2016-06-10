import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {IHtmlReportsService, ReportType, HtmlReportsServiceRequest, HtmlReportsServiceResponse} from './IHtmlReportsService';
import {IHtmlToPdfConverterService} from '../htmltopdf/IHtmlToPdfConverterService';

export abstract class AHtmlReportsService implements IHtmlReportsService{
    
    constructor(protected _unitPalConfig: UnitPalConfig, protected _htmlToPdfConverterService: IHtmlToPdfConverterService) {
           
    }
    
    public abstract generateReport(htmlReportsServiceRequest: HtmlReportsServiceRequest): Promise<HtmlReportsServiceResponse>;  
}