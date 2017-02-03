import { UnitPalConfig } from '../../utils/environment/UnitPalConfig';
import { IPdfReportsService, ReportType, PdfReportsServiceRequest, PdfReportsServiceResponse } from './IPdfReportsService';
import { IHtmlToPdfConverterService } from '../html-to-pdf/IHtmlToPdfConverterService';
import { IFileService } from '../file-service/IFileService';

export abstract class APdfReportsService implements IPdfReportsService {

    constructor(protected _unitPalConfig: UnitPalConfig,
        protected _htmlToPdfConverterService: IHtmlToPdfConverterService,
        protected _fileService: IFileService) {

    }

    public abstract generatePdfReport(htmlReportsServiceRequest: PdfReportsServiceRequest): Promise<PdfReportsServiceResponse>;
}