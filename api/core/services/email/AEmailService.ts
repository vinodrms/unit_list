import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {AppContext} from '../../utils/AppContext';
import {BaseEmailTemplateDO} from './data-objects/BaseEmailTemplateDO';
import {IEmailService, EmailHeaderDO} from './IEmailService';

export abstract class AEmailService implements IEmailService {

	constructor(protected _unitPalConfig: UnitPalConfig, protected _emailHeaderDO: EmailHeaderDO, protected _emailTemplate: BaseEmailTemplateDO) {
    }

	public abstract sendEmail(): Promise<any>;
}