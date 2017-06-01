import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThUtils } from "../../../../../utils/ThUtils";
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';
import { MongoBedRepository } from '../../../../../data-layer/beds/repositories/mongo/MongoBedRepository';
import { MongoPatchType } from '../patches/MongoPatchType';
import { MongoHotelRepository } from "../../../../../data-layer/hotel/repositories/mongo/MongoHotelRepository";
import { MongoCustomerRepository } from "../../../../../data-layer/customers/repositories/mongo/MongoCustomerRepository";
import { MongoInvoiceGroupsRepository } from "../../../../../data-layer/invoices/repositories/mongo/MongoInvoiceGroupsRepository";
import { MongoRepository } from "../../../../../data-layer/common/base/MongoRepository";
import { MongoBookingRepository } from "../../../../../data-layer/bookings/repositories/mongo/MongoBookingRepository";

/**
 * Extend this class when the multi update can be made with a simple MongoDB Query
 */
export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
	protected _thUtils: ThUtils;

	protected _hotelRepository: MongoHotelRepository;
	protected _bedRepository: MongoBedRepository;
	protected _priceProductRepository: MongoPriceProductRepository;
	protected _customerRepository: MongoCustomerRepository;
	protected _invoiceGroupsRepository: MongoInvoiceGroupsRepository;
	protected _bookingRepository: MongoBookingRepository;

	constructor() {
		this._thUtils = new ThUtils();

		this._hotelRepository = new MongoHotelRepository();
		this._bedRepository = new MongoBedRepository();
		this._priceProductRepository = new MongoPriceProductRepository();
		this._customerRepository = new MongoCustomerRepository();
		this._invoiceGroupsRepository = new MongoInvoiceGroupsRepository(this._hotelRepository);
		this._bookingRepository = new MongoBookingRepository();
	}

	public apply(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			try {
				this.applyCore(resolve, reject);
			} catch (e) {
				reject(e);
			}
		});
	}
	public abstract getPatchType(): MongoPatchType;
	protected abstract applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void });
}