export interface IEmailTemplateBuilder {
	buildEmailContentAsyncWrapper(finishBuildEmailContentCallback: { (err: any, emailContent?: string): void; });
}