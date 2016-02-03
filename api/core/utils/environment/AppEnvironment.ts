export enum AppEnvironmentType {
	Development,
	Test,
	Production
}

export class AppEnvironment {
	public static getAppEnvironment() : AppEnvironmentType {
		switch (sails.config.environment) {
			case 'development' : 
				return AppEnvironmentType.Development;
			case 'test' : 
				return AppEnvironmentType.Test;
			default:
				return AppEnvironmentType.Production;
		}
	}
}