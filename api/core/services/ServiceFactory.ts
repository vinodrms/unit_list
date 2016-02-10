import {UnitPalConfig, EmailProviderType, ImageStorageProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
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

export class ServiceFactory {
    constructor(private _unitPalConfig: UnitPalConfig) {
    }

    public getVatProvider(): IVatProvider {
        return new VIESVatProviderAdapter();
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
}