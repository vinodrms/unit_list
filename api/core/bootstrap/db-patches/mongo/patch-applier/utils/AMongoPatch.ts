import {IMongoPatchApplier} from './IMongoPatchApplier';
import {IMongoPatch} from './IMongoPatch';

export enum MongoPatcheType {
	CreateUniqueIndexOnHotel,
    PopulateCountriesAndCurrencyCodes
}

export abstract class AMongoPatch implements IMongoPatchApplier, IMongoPatch {
	constructor() { }
	public abstract apply(): Promise<boolean>;
	public abstract getPatchType(): MongoPatcheType;
}