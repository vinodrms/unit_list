export abstract class EmailTemplate {
    
    constructor(protected _emailTemplateDO: any) {    
    }
    
    public getEmailTemplateDO(): any {
        return this._emailTemplateDO;
    }
    
    public abstract getTemplateMetadata(): any;
}