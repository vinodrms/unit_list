import {UnitPalConfig, EmailProviderType, ImageStorageProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VatProviderProxyService} from './vat/VatProviderProxyService';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {IEmailService, EmailHeaderDO} from './email/IEmailService';
import {BaseEmailTemplateDO} from './email/data-objects/BaseEmailTemplateDO'
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
import {IHtmlToPdfConverterService} from './htmltopdf/IHtmlToPdfConverterService';
import {PhantomHtmlToPdfConverterService} from './htmltopdf/providers/phantom/PhantomHtmlToPdfConverterService';
import {IHtmlReportsService} from './html-reports/IHtmlReportsService';
import {HtmlReportsService} from './html-reports/providers/HtmlReportsService';

export class ServiceFactory {
    constructor(private _unitPalConfig: UnitPalConfig) {
    }

    public getVatProviderProxyService(): IVatProvider {
        return new VatProviderProxyService(this._unitPalConfig);
    }
    public getEmailService(emailHeaderDO: EmailHeaderDO, emailTemplate: BaseEmailTemplateDO): IEmailService {
        switch (this._unitPalConfig.getEmailProviderType()) {
            case EmailProviderType.Sendgrid:
                return new SendgridEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
            default:
                return new MockEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
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
    public getHtmltoPdfConverterService(): IHtmlToPdfConverterService {
        return new PhantomHtmlToPdfConverterService();   
    }
    public getHtmlReportsService(htmlToPdfConverterService: IHtmlToPdfConverterService): IHtmlReportsService {
        return new HtmlReportsService(this._unitPalConfig, htmlToPdfConverterService);   
    }
}