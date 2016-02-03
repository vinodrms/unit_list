import {AppEnvironmentType, AppEnvironment} from './environment/AppEnvironment';
import {ServiceFactory} from '../services/ServiceFactory';

export class AppContext {
	private _serviceFactory : ServiceFactory;
	
	constructor(private _appEnvironmentType : AppEnvironmentType) {
		this._serviceFactory = new ServiceFactory(this._appEnvironmentType);
	}
	
	public getServiceFactory() : ServiceFactory {
		return this._serviceFactory;
	}
}