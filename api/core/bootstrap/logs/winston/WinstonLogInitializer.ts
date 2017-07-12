import { ILogInitializer } from '../ILogInitializer';
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { UnitPalConfig, LoggerChannel, LoggerChannelType } from "../../../utils/environment/UnitPalConfig";
import { ThUtils } from "../../../utils/ThUtils";

import winston = require('winston');

require('winston-mongodb').MongoDB;
require('winston-papertrail').Papertrail;

import _ = require('underscore');

export class WinstonLogInitializer implements ILogInitializer {
    private _loggerChannels: LoggerChannel[];
    private _thUtils: ThUtils;

    constructor(_unitpalConfig: UnitPalConfig) {
        this._loggerChannels = _unitpalConfig.getLoggerChannels();
        this._thUtils = new ThUtils();
    }

    public initLogger() {
        // Remove default winston log channel
        winston.remove(winston.transports.Console);
        
        _.forEach(this._loggerChannels, (loggerChannel: LoggerChannel) => {
            winston.add(this.getWinstonTransport(loggerChannel.type), loggerChannel.options);
        });
    }

    private getWinstonTransport(loggerChannelType: LoggerChannelType): any {
        let transports: any = winston.transports;

        switch (loggerChannelType) {
            case LoggerChannelType.Console:
                return transports.Console;
            case LoggerChannelType.File:
                return transports.File;
            case LoggerChannelType.Papertrail:
                return transports.Papertrail;
            case LoggerChannelType.Mongo:
                return transports.MongoDB;
        }
    }
}