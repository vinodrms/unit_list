export enum DatabaseType {
	MongoDB
}

export class DatabaseSettings {
	public static getDatabaseType() : DatabaseType {		
		switch (sails.config.appDatabaseConfig.dbType) {
			case 'mongodb' : 
				return DatabaseType.MongoDB;
			default:
				return DatabaseType.MongoDB;
		}
	}
}