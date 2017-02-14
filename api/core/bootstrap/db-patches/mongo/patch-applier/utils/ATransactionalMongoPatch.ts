import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';
import { MongoBedRepository } from '../../../../../data-layer/beds/repositories/mongo/MongoBedRepository';
import { MongoPatchType } from '../patches/MongoPatchType';

export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
	protected _priceProductRepository: MongoPriceProductRepository;
	protected _bedRepository: MongoBedRepository;

	constructor() {
		this._priceProductRepository = new MongoPriceProductRepository();
		this._bedRepository = new MongoBedRepository();
	}

	public apply(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	public abstract getPatchType(): MongoPatchType;
	protected abstract applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void });
}