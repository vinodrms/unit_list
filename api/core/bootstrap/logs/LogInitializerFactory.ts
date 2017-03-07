import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import { ILogInitializer } from './ILogInitializer';
import { WinstonLogInitializer } from "./winston/WinstonLogInitializer";


export class LogInitializerFactory {
	
	constructor(private _unitPalConfig: UnitPalConfig) {
		
	}

	public getLogInitializer(): ILogInitializer {
		return new WinstonLogInitializer(this._unitPalConfig);
	}
}