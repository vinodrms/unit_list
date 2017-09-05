import { UnitPalConfig } from './environment/UnitPalConfig';
import { ServiceFactory } from '../services/ServiceFactory';
import { RepositoryFactory } from '../data-layer/RepositoryFactory';
import { ThTranslation } from '../utils/localization/ThTranslation';
import { ThUtils } from "./ThUtils";

export class AppContext {
    private _serviceFactory: ServiceFactory;
    private _repositoryFactory: RepositoryFactory;
    private _thTranslate: ThTranslation;
    private _thUtils: ThUtils;

    constructor(private _unitPalConfig: UnitPalConfig) {
        this._serviceFactory = new ServiceFactory(this._unitPalConfig);
        this._repositoryFactory = new RepositoryFactory(this._unitPalConfig);
        this._thUtils = new ThUtils();
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

    public get thTranslate(): ThTranslation {
        return this._thTranslate;
    }

    public set thTranslate(v: ThTranslation) {
        this._thTranslate = v;
    }

    public get thUtils(): ThUtils {
        return this._thUtils;
    }
    public set thUtils(value: ThUtils) {
        this._thUtils = value;
    }
}
