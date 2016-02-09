import {UnitPalConfig, EmailProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {AEmailService, EmailHeaderDO} from './email/AEmailService';
import {BaseEmailTemplateDO} from './email/data-objects/BaseEmailTemplateDO'
import {MockEmailService} from './email/providers/mock/MockEmailService';
import {SendgridEmailService} from './email/providers/sendgrid/SendgridEmailService';
import {ILoginService} from './login/ILoginService';
import {PassportLoginService} from './login/custom/PassportLoginService';

export class ServiceFactory {
    constructor(private _unitPalConfig: UnitPalConfig) {
    }

    public getVatProvider(): IVatProvider {
        return new VIESVatProviderAdapter();
    }
    public getEmailService(emailHeaderDO: EmailHeaderDO, emailTemplate: BaseEmailTemplateDO): AEmailService {
        switch (this._unitPalConfig.getEmailProviderType()) {
            case EmailProviderType.Sendgrid:
                return new SendgridEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
            default:
                return new MockEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
        }
    }
    public getLoginService(): ILoginService {
        return new PassportLoginService();
    }
}