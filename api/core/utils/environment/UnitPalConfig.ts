export enum DatabaseType {
	MongoDB
}
export enum EmailProviderType {
	StaticSmtp,
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

	constructor() {
		this.updateAppEnvironment();
		this.updateDatabaseType();
		this.updateEmailProvider();
	}
	private updateAppEnvironment() {
		switch (sails.config.environment) {
			case 'development' : 
				this._appEnvironment = AppEnvironmentType.Development;
			case 'test' : 
				this._appEnvironment = AppEnvironmentType.Test;
			default:
				this._appEnvironment = AppEnvironmentType.Production;
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
			case "mock":
				this._emailProviderType = EmailProviderType.Mock;
				break;
			default:
				this._emailProviderType = EmailProviderType.StaticSmtp;
				break;
		}
		this._emailProviderSettings = sails.config.unitPalConfig.emailService.settings;
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
}