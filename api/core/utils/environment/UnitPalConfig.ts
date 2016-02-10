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
export enum AppEnvironmentType {
    Development,
    Test,
    Production
}

export class UnitPalConfig {
    private _appEnvironment: AppEnvironmentType;
    private _databaseType: DatabaseType;
    private _emailProviderType: EmailProviderType;
    private _emailProviderSettings: Object;
    private _imageStorageProviderType: ImageStorageProviderType;
    private _imageStorageProviderSettings: Object;
    private _appContextRoot: string;

    constructor() {
        this.updateAppEnvironment();
        this.updateDatabaseType();
        this.updateEmailProvider();
        this.updateImageStorageProvider();
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
    private updateAppContextRoot() {
        this._appContextRoot = sails.config.unitPalConfig.appContextRoot;
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
    public getAppContextRoot(): string {
        return this._appContextRoot;
    }
}