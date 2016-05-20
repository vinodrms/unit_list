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
import {NotificationService} from './notifications/providers/NotificationService';

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
    public getNotificationService(): INotificationService {
        return new NotificationService(this._unitPalConfig);
    }
}