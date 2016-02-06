import {UnitPalConfig, EmailProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {AEmailService, EmailMetadataDO} from './email/sender/AEmailService';
import {SmtpEmailService} from './email/sender/custom/SmtpEmailService';
import {MockEmailService} from './email/sender/custom/MockEmailService';
import {AEmailTemplateBuilder} from './email/content-builder/AEmailTemplateBuilder';

export class ServiceFactory {
	constructor(private _unitPalConfig: UnitPalConfig) {
	}

	public getVatProvider(): IVatProvider {
		return new VIESVatProviderAdapter();
	}
	public getEmailService(emailMetadataDO: EmailMetadataDO, templateBuilder: AEmailTemplateBuilder): AEmailService {
		switch (this._unitPalConfig.getEmailProviderType()) {
			case EmailProviderType.StaticSmtp:
				return new SmtpEmailService(this._unitPalConfig, emailMetadataDO, templateBuilder);
			case EmailProviderType.Mock:
				return new MockEmailService(this._unitPalConfig, emailMetadataDO, templateBuilder);
		}
	}
}