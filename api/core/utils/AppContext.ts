import { UnitPalConfig } from './environment/UnitPalConfig';
import { ServiceFactory } from '../services/ServiceFactory';
import { RepositoryFactory } from '../data-layer/RepositoryFactory';
import { ThTranslation } from '../utils/localization/ThTranslation';

export class AppContext {
	private _serviceFactory: ServiceFactory;
	private _repositoryFactory: RepositoryFactory;
	private _thTranslate: ThTranslation;

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

	public get thTranslate() : ThTranslation {
		return this._thTranslate;
	}
	
	public set thTranslate(v : ThTranslation) {
		this._thTranslate = v;
	}
	
}