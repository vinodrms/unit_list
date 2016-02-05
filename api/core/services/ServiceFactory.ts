import {UnitPalConfig, EmailProviderType} from '../utils/environment/UnitPalConfig';
import {IVatProvider} from './vat/IVatProvider';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';
import {AEmailSender, EmailSenderDO} from './email/sender/AEmailSender';
import {SmtpEmailSender} from './email/sender/custom/SmtpEmailSender';
import {MockEmailSender} from './email/sender/custom/MockEmailSender';
import {AEmailTemplateBuilder} from './email/content-builder/AEmailTemplateBuilder';

export class ServiceFactory {
	constructor(private _unitPalConfig: UnitPalConfig) {
	}
	
	public getVatProvider() : IVatProvider {
		return new VIESVatProviderAdapter();
	}
	public getEmailSender(emailSenderDO: EmailSenderDO, templateBuilder: AEmailTemplateBuilder) : AEmailSender {
		switch(this._unitPalConfig.getEmailProviderType()) {
			case EmailProviderType.StaticSmtp:
				return new SmtpEmailSender(this._unitPalConfig, emailSenderDO, templateBuilder);
			case EmailProviderType.Mock:
				return new MockEmailSender(this._unitPalConfig, emailSenderDO, templateBuilder);
		}
	}
}