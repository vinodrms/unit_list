export class EmailHeaderDO {
	destinationEmail: string;
	subject: string;
    attachments: string[];
}

export interface IEmailService {
    sendEmailAsync(finishSendEmailCallback: { (err: any, reesult?: string): void; });
}