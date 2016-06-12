import {ThError} from '../th-responses/ThError';
import {IThAuditLogger, ThAuditMessage} from './ThAuditLogger';
import {ThStatusCode, ThResponse} from '../th-responses/ThResponse';
import {ThLogger, ThLogLevel} from './ThLogger';

import util = require('util');
var Slack = require('slack-node');

export class SlackAuditLogger implements IThAuditLogger {
    private _paramsInitialized: boolean = false;

    private _webhookUri: string;
    private _channel: string;
    private _username: string;
    private _serverContextRoot: string;

    private _slack: any;

    constructor() {
    }

    private initParamsIfNecessary() {
        if (this._paramsInitialized) { return; }

        this._webhookUri = sails.config.unitPalConfig.slack.webhookUri;
        this._channel = sails.config.unitPalConfig.slack.channel;
        this._username = sails.config.unitPalConfig.slack.username;
        this._serverContextRoot = sails.config.unitPalConfig.appContextRoot;

        this._slack = new Slack();
        this._slack.setWebhook(this._webhookUri);

        this._paramsInitialized = true;
    }

    log(auditMessage: ThAuditMessage) {
        this.initParamsIfNecessary();

        this._slack.webhook({
            channel: this._channel,
            username: this._username,
            text: this.getFullMessage(auditMessage.message)
        }, function (err, response) {
            if (err || !response) {
                var thError = new ThError(ThStatusCode.SlackSendMessageError, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Slack send error", { message: auditMessage.message, response: response }, thError);
            }
        });
    }
    private getFullMessage(message: string): string {
        return util.format("%s %s", this._serverContextRoot, message);
    }
}