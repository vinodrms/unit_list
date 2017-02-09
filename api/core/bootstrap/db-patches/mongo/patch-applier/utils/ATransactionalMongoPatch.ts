import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';

export enum MongoPatcheType {
	CreateUniqueIndexOnHotel,
	PopulateCountriesAndCurrencyCodes,
	SetValueForFirstChildWithAdultInSharedBedPriceOnPriceProducts,

}

export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
	protected _priceProductRepository: MongoPriceProductRepository;

	constructor() {
		this._priceProductRepository = new MongoPriceProductRepository();
	}

	public apply(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	public abstract getPatchType(): MongoPatcheType;
	protected abstract applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void });
}