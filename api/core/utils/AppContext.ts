import {UnitPalConfig} from './environment/UnitPalConfig';
import {ServiceFactory} from '../services/ServiceFactory';
import {RepositoryFactory} from '../data-layer/RepositoryFactory';

export class AppContext {
	private _serviceFactory: ServiceFactory;
	private _repositoryFactory: RepositoryFactory;

	constructor(private _unitPalConfig: UnitPalConfig) {
		this._serviceFactory = new ServiceFactory(this._unitPalConfig);
		this._repositoryFactory = new RepositoryFactory(this._unitPalConfig);
	}

	public getServiceFactory(): ServiceFactory {
		return this._serviceFactory;
	}
	public getRepositoryFactory(): RepositoryFactory {
		return this._repositoryFactory;
	}
	public getUnitPalConfig(): UnitPalConfig {
		return this._unitPalConfig;
	}
}