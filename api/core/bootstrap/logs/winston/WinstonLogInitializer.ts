import { ILogInitializer } from '../ILogInitializer';
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { UnitPalConfig, LoggerChannel, LoggerChannelType } from "../../../utils/environment/UnitPalConfig";

import winston = require('winston');

require('winston-mongodb').MongoDB;
require('winston-papertrail').Papertrail;

import _ = require('underscore');
import { ThUtils } from "../../../utils/ThUtils";

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
        switch (loggerChannelType) {
            case LoggerChannelType.Console:
                return winston.transports.Console;
            case LoggerChannelType.File:
                return winston.transports.File;
            case LoggerChannelType.Papertrail:
                return winston.transports.Papertrail;
            case LoggerChannelType.Mongo:
                return winston.transports.MongoDB;
        }
    }
}