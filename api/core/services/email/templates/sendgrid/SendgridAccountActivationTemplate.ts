import {EmailTemplate} from '../EmailTemplate';

export class SendgridAccountActivationTemplate extends EmailTemplate {
	
    public getTemplateMetadata(): any {
		return {
            id: '1b22b1f6-775a-4576-895f-acd79bed6059',
            subs: {
                "%firstName%": [
                    this._emailTemplateDO.firstName
                ],
                "%lastName%": [
                    this._emailTemplateDO.lastName
                ],
                "%email%": [
                    this._emailTemplateDO.email
                ],
                "%activationLink%": [
                    this._emailTemplateDO.activationLink
                ]
            }
        };
	}
}