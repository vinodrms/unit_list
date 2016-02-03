import {AppEnvironmentType} from '../utils/environment/AppEnvironment';

import {IVatProvider} from './vat/IVatProvider';
import {VIESVatAdapter} from './vat/providers/VIESVatAdapter';

export class ServiceFactory {
	constructor(private _appEnvironment : AppEnvironmentType) {
	}
	
	public getVatProvider() : IVatProvider {
		return new VIESVatAdapter();
	}
}