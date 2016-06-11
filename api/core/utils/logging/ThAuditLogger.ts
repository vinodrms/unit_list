import {SlackAuditLogger} from './SlackAuditLogger';

export interface ThAuditMessage {
    message: string;
}

export interface IThAuditLogger {
    log(auditMessage: ThAuditMessage);
}

export class ThAuditLogger {
    private static _auditLogger: IThAuditLogger = new SlackAuditLogger();
    public static getInstance(): IThAuditLogger {
        return this._auditLogger;
    }
}