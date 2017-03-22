import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';
import { MongoBedRepository } from '../../../../../data-layer/beds/repositories/mongo/MongoBedRepository';
import { MongoBookingRepository } from '../../../../../data-layer/bookings/repositories/mongo/MongoBookingRepository';
import { MongoPatchType } from '../patches/MongoPatchType';
import { MongoHotelRepository } from "../../../../../data-layer/hotel/repositories/mongo/MongoHotelRepository";

export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
	protected _priceProductRepository: MongoPriceProductRepository;
	protected _bedRepository: MongoBedRepository;
	protected _bookingRepository: MongoBookingRepository;
	protected _hotelRepository: MongoHotelRepository;

	constructor() {
		this._priceProductRepository = new MongoPriceProductRepository();
		this._bedRepository = new MongoBedRepository();
		this._bookingRepository = new MongoBookingRepository();
		this._hotelRepository = new MongoHotelRepository();
	}

	public apply(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.applyCore(resolve, reject);
		});
	}
	public abstract getPatchType(): MongoPatchType;
	protected abstract applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void });
}