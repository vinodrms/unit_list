import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {AppContext} from '../../utils/AppContext';
import {BaseEmailTemplateDO} from './data-objects/BaseEmailTemplateDO';
import {IEmailService, EmailHeaderDO} from './IEmailService';

export abstract class AEmailService implements IEmailService {

	constructor(protected _unitPalConfig: UnitPalConfig) {
    }

	public abstract sendEmail(_emailHeaderDO: EmailHeaderDO, _emailTemplate: BaseEmailTemplateDO): Promise<any>;
}