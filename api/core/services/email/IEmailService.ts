export class EmailHeaderDO {
	destinationEmail: string;
	subject: string;
    attachments: string[];
}

export interface IEmailService {
	sendEmail(): Promise<any>;
}