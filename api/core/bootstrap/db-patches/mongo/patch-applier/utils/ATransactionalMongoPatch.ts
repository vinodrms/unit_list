import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';
import { MongoBedRepository } from '../../../../../data-layer/beds/repositories/mongo/MongoBedRepository';
import { MongoBookingRepository } from '../../../../../data-layer/bookings/repositories/mongo/MongoBookingRepository';
import { MongoPatchType } from '../patches/MongoPatchType';
import { ThUtils } from "../../../../../utils/ThUtils";

/**
 * Extend this class when the multi update can be made with a simple MongoDB Query
 */
export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
	protected _thUtils: ThUtils;

	protected _priceProductRepository: MongoPriceProductRepository;
	protected _bedRepository: MongoBedRepository;
	protected _bookingRepository: MongoBookingRepository;

	constructor() {
		this._thUtils = new ThUtils();

		this._priceProductRepository = new MongoPriceProductRepository();
		this._bedRepository = new MongoBedRepository();
		this._bookingRepository = new MongoBookingRepository();
	}

	public apply(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	public abstract getPatchType(): MongoPatchType;
	protected abstract applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void });
}