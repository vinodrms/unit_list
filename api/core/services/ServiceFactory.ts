import {AppEnvironmentType} from '../utils/environment/AppEnvironment';

import {IVatProvider} from './vat/IVatProvider';
import {VIESVatProviderAdapter} from './vat/providers/VIESVatProviderAdapter';

export class ServiceFactory {
	constructor(private _appEnvironment : AppEnvironmentType) {
	}
	
	public getVatProvider() : IVatProvider {
		return new VIESVatProviderAdapter();
	}
}