import {AppEnvironmentType} from './environment/AppEnvironment';
import {DatabaseType} from './environment/DatabaseSettings';
import {ServiceFactory} from '../services/ServiceFactory';

export class AppContext {
	private _serviceFactory: ServiceFactory;

	constructor(private _appEnvironmentType: AppEnvironmentType, private _databaseType: DatabaseType) {
		this._serviceFactory = new ServiceFactory(this._appEnvironmentType);
	}

	public getServiceFactory(): ServiceFactory {
		return this._serviceFactory;
	}
}