import {UnitPalConfig, EmailProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {AEmailService, EmailHeaderDO} from './email/sender/AEmailService';
import {EmailTemplate} from './email/templates/EmailTemplate'
import {MockEmailService} from './email/sender/providers/MockEmailService';
import {SendgridEmailService} from './email/sender/providers/SendgridEmailService';

export class ServiceFactory {
	constructor(private _unitPalConfig: UnitPalConfig) {
	}

	public getVatProvider(): IVatProvider {
		return new VIESVatProviderAdapter();
	}
    
	public getEmailService(emailHeaderDO: EmailHeaderDO, emailTemplate: EmailTemplate): AEmailService {
		switch (this._unitPalConfig.getEmailProviderType()) {
			case EmailProviderType.Mock:
				return new MockEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
            case EmailProviderType.Sendgrid:
                return new SendgridEmailService(this._unitPalConfig, emailHeaderDO, emailTemplate);
		}
        return null;
	}
}