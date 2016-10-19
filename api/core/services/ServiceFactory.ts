import {UnitPalConfig, EmailProviderType, ImageStorageProviderType, PdfReportsProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VatProviderProxyService} from './vat/VatProviderProxyService';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {IEmailService} from './email/IEmailService';
import {MockEmailService} from './email/providers/mock/MockEmailService';
import {SendgridEmailService} from './email/providers/sendgrid/SendgridEmailService';
import {ILoginService} from './login/ILoginService';
import {IImageStorageService} from './image-storage/IImageStorageService';
import {CloudinaryImageStorageService} from './image-storage/cloudinary/CloudinaryImageStorageService';
import {MockImageStorageService} from './image-storage/mock/MockImageStorageService';
import {PassportLoginService} from './login/custom/PassportLoginService';
import {MomentTimeZonesService} from './time-zones/providers/moment/MomentTimeZonesService';
import {ITimeZonesService} from './time-zones/ITimeZonesService';
import {INotificationService} from './notifications/INotificationService';
import {NotificationServicePushDecorator} from './notifications/providers/NotificationServicePushDecorator';
import {NotificationService} from './notifications/providers/NotificationService';
import {ISocketsService} from './sockets/ISocketsService';
import {SocketIoService} from './sockets/providers/SocketIoService';
import {IHtmlToPdfConverterService} from './html-to-pdf/IHtmlToPdfConverterService';
import {PhantomLocalHtmlToPdfConverterService} from './html-to-pdf/providers/phantom/PhantomLocalHtmlToPdfConverterService';
import {IPdfReportsService} from './pdf-reports/IPdfReportsService';
import {PdfReportsService} from './pdf-reports/providers/PdfReportsService';
import {MockPdfReportsService} from './pdf-reports/providers/MockPdfReportsService';
import {IFileService} from './file-service/IFileService'
import {FileService} from './file-service/FileService'

export class ServiceFactory {
    constructor(private _unitPalConfig: UnitPalConfig) {
    }

    public getVatProviderProxyService(): IVatProvider {
        return new VatProviderProxyService(this._unitPalConfig);
    }
    public getEmailService(): IEmailService {
        switch (this._unitPalConfig.getEmailProviderType()) {
            case EmailProviderType.Sendgrid:
                return new SendgridEmailService(this._unitPalConfig);
            default:
                return new MockEmailService(this._unitPalConfig);
        }
    }
    public getImageStorageService(): IImageStorageService {
        switch (this._unitPalConfig.getImageStorageProviderType()) {
            case ImageStorageProviderType.Cloudinary:
                return new CloudinaryImageStorageService(this._unitPalConfig);
            case ImageStorageProviderType.Mock:
                return new MockImageStorageService(this._unitPalConfig);
            default:
                return new CloudinaryImageStorageService(this._unitPalConfig);
        }
    }
    public getLoginService(): ILoginService {
        return new PassportLoginService();
    }
    public getTimeZonesService(): ITimeZonesService {
        return new MomentTimeZonesService();
    }
    public getSocketsService(): ISocketsService {
        return new SocketIoService(sails.config.ws);    
    }
    public getNotificationService(): INotificationService {
        return new NotificationServicePushDecorator(new NotificationService(this._unitPalConfig), this.getSocketsService());
    }
    public getPdfReportsService(): IPdfReportsService {
        switch (this._unitPalConfig.getPdfReportsProviderType()) {
            case PdfReportsProviderType.Real:
                return new PdfReportsService(this._unitPalConfig, this.getHtmltoPdfConverterService());
            case PdfReportsProviderType.Mock:
                return new MockPdfReportsService(this._unitPalConfig, this.getHtmltoPdfConverterService());
            default:
                return new PdfReportsService(this._unitPalConfig, this.getHtmltoPdfConverterService());
        }
           
    }
    public getHtmltoPdfConverterService(): IHtmlToPdfConverterService {
        return new PhantomLocalHtmlToPdfConverterService();   
    }
    
    public getFileService():IFileService{
        return new FileService();
    }
}