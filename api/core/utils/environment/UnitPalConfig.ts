import _ = require('underscore');

export enum DatabaseType {
    MongoDB
}
export enum EmailProviderType {
    StaticSmtp,
    Sendgrid,
    Mock
}
export enum ImageStorageProviderType {
    Cloudinary,
    Mock
}
export enum PdfReportsProviderType {
    Real,
    Mock
}
export enum AppEnvironmentType {
    Development,
    Test,
    Production
}
export interface GoogleAnalyticsSettings {
    enabled: boolean;
    trackingId: string;
}
export enum LoggerChannelType {
    Console,
    File,
    Papertrail,
    Mongo
}
export interface LoggerChannel {
    type: LoggerChannelType;
    options: Object;
}

declare var sails: any;

export class UnitPalConfig {
    private _appEnvironment: AppEnvironmentType;
    private _databaseType: DatabaseType;
    private _emailProviderType: EmailProviderType;
    private _emailProviderSettings: Object;
    private _imageStorageProviderType: ImageStorageProviderType;
    private _imageStorageProviderSettings: Object;
    private _pdfReportsProviderType: PdfReportsProviderType;
    private _pdfReportsProviderSettings: Object;
    private _googleAnalyticsSettings: GoogleAnalyticsSettings;
    private _appContextRoot: string;
    private _defaultClientSessionEnabled: boolean;

    constructor() {
        this.updateAppEnvironment();
        this.updateDefaultClientSessionEnabled();
        this.updateDatabaseType();
        this.updateEmailProvider();
        this.updateImageStorageProvider();
        this.updatePdfReportsProvider();
        this.updateGoogleAnalyticsSettings();
        this.updateAppContextRoot();
    }
    private updateAppEnvironment() {
        switch (sails.config.environment) {
            case 'development':
                this._appEnvironment = AppEnvironmentType.Development;
                break;
            case 'test':
                this._appEnvironment = AppEnvironmentType.Test;
                break;
            default:
                this._appEnvironment = AppEnvironmentType.Production;
                break;
        }
    }
    private updateDefaultClientSessionEnabled() {
        this._defaultClientSessionEnabled = false;
        if (_.isBoolean(sails.config.unitPalConfig.defaultClientSessionEnabled) && sails.config.unitPalConfig.defaultClientSessionEnabled) {
            this._defaultClientSessionEnabled = true;
        }
    }
    private updateDatabaseType() {
        switch (sails.config.unitPalConfig.dbType) {
            default:
                this._databaseType = DatabaseType.MongoDB;
                break;
        }
    }
    private updateEmailProvider() {
        switch (sails.config.unitPalConfig.emailService.type) {
            case 'mock':
                this._emailProviderType = EmailProviderType.Mock;
                break;
            case 'sendgrid':
                this._emailProviderType = EmailProviderType.Sendgrid;
                break;
            default:
                this._emailProviderType = EmailProviderType.Mock;
                break;
        }
        this._emailProviderSettings = sails.config.unitPalConfig.emailService.settings;
    }
    private updateImageStorageProvider() {
        switch (sails.config.unitPalConfig.imageUploadService.type) {
            case 'mock':
                this._imageStorageProviderType = ImageStorageProviderType.Mock;
                break;
            case 'cloudinary':
                this._imageStorageProviderType = ImageStorageProviderType.Cloudinary;
                break;
            default:
                this._imageStorageProviderType = ImageStorageProviderType.Mock;
                break;
        }
        this._imageStorageProviderSettings = sails.config.unitPalConfig.imageUploadService.settings;
    }
    private updatePdfReportsProvider() {
        switch (sails.config.unitPalConfig.pdfReportsService.type) {
            case 'mock':
                this._pdfReportsProviderType = PdfReportsProviderType.Mock;
                break;
            case 'real':
                this._pdfReportsProviderType = PdfReportsProviderType.Real;
                break;
            default:
                this._pdfReportsProviderType = PdfReportsProviderType.Real;
                break;
        }
        this._pdfReportsProviderSettings = sails.config.unitPalConfig.pdfReportsService.settings;
    }
    private updateGoogleAnalyticsSettings() {
        this._googleAnalyticsSettings = sails.config.unitPalConfig.googleAnalytics;
    }
    private updateAppContextRoot() {
        this._appContextRoot = sails.config.unitPalConfig.appContextRoot;
        // the app context root should not end with '/'
        if (this._appContextRoot.lastIndexOf("/") === this._appContextRoot.length - 1) {
            this._appContextRoot = this._appContextRoot.substring(0, this._appContextRoot.length - 1);
        }
    }
    public getAppEnvironment(): AppEnvironmentType {
        return this._appEnvironment;
    }
    public getDatabaseType(): DatabaseType {
        return this._databaseType;
    }
    public getEmailProviderType(): EmailProviderType {
        return this._emailProviderType;
    }
    public getEmailProviderSettings(): Object {
        return this._emailProviderSettings;
    }
    public getImageStorageProviderType(): ImageStorageProviderType {
        return this._imageStorageProviderType;
    }
    public getImageStorageProviderSettings(): Object {
        return this._imageStorageProviderSettings;
    }
    public getPdfReportsProviderType(): PdfReportsProviderType {
        return this._pdfReportsProviderType;
    }
    public getPdfReportsProviderSettings(): Object {
        return this._pdfReportsProviderSettings;
    }
    public getAppContextRoot(): string {
        return this._appContextRoot;
    }
    public getGoogleAnalyticsSettings(): GoogleAnalyticsSettings {
        return this._googleAnalyticsSettings;
    }
    public getLoggerChannels(): LoggerChannel[] {
        let rawLoggerChannels = sails.config.unitPalConfig.loggerChannels;
        let loggerChannels: LoggerChannel[] = [];

        _.forEach(rawLoggerChannels, (rawLoggerChannel: any) => {

            switch (rawLoggerChannel.type) {
                case 'console':
                    loggerChannels.push({
                        type: LoggerChannelType.Console,
                        options: rawLoggerChannel.options
                    });
                    break;
                case 'file':
                    loggerChannels.push({
                        type: LoggerChannelType.File,
                        options: rawLoggerChannel.options
                    });
                    break;
                case 'papertrail':
                    loggerChannels.push({
                        type: LoggerChannelType.Papertrail,
                        options: rawLoggerChannel.options
                    });
                    break;
                case 'mongo':
                    loggerChannels.push({
                        type: LoggerChannelType.Mongo,
                        options: rawLoggerChannel.options
                    });
                    break;
            }
        });

        return loggerChannels;
    }
    public defaultClientSessionIsEnabled(): boolean {
        return this._defaultClientSessionEnabled;
    }
}