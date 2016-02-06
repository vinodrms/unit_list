export interface IEmailTemplateBuilder {
	buildEmailContentAsync(finishBuildEmailContentCallback: { (err: any, emailContent?: string): void; });
}