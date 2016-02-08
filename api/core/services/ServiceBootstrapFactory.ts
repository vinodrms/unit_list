import {UnitPalConfig} from '../utils/environment/UnitPalConfig';
import {PassportLoginService} from './login/custom/PassportLoginService';
import {ILoginServiceInitializer} from './login/ILoginServiceInitializer';

export class ServiceBootstrapFactory {
	constructor(private _unitPalConfig: UnitPalConfig) {
	}

	public getLoginServiceInitializer(): ILoginServiceInitializer {
		return new PassportLoginService();
	}
}