import { IMongoPatchApplier } from './IMongoPatchApplier';
import { IMongoPatch } from './IMongoPatch';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThUtils } from "../../../../../utils/ThUtils";
import { MongoPriceProductRepository } from '../../../../../data-layer/price-products/repositories/mongo/MongoPriceProductRepository';
import { MongoBedRepository } from '../../../../../data-layer/beds/repositories/mongo/MongoBedRepository';
import { MongoPatchType } from '../patches/MongoPatchType';
import { MongoHotelRepository } from "../../../../../data-layer/hotel/repositories/mongo/MongoHotelRepository";
import { MongoCustomerRepository } from "../../../../../data-layer/customers/repositories/mongo/MongoCustomerRepository";
import { MongoInvoiceGroupsRepository as LegacyMongoInvoiceGroupsRepository } from "../../../../../data-layer/invoices-legacy/repositories/mongo/MongoInvoiceGroupsRepository";
import { MongoRepository } from "../../../../../data-layer/common/base/MongoRepository";
import { MongoBookingRepository } from "../../../../../data-layer/bookings/repositories/mongo/MongoBookingRepository";
import { MongoInvoiceRepository } from '../../../../../data-layer/invoices/repositories/mongo/MongoInvoiceRepository';
import { MongoInvoiceRepositoryWithBookingPriceLink } from '../../../../../data-layer/invoices/repositories/mongo/decorators/MongoInvoiceRepositoryWithBookingPriceLink';
import { MongoAddOnProductRepository } from '../../../../../data-layer/add-on-products/repositories/mongo/MongoAddOnProductRepository';
import { MongoSettingsRepository } from "../../../../../data-layer/settings/repositories/mongo/MongoSettingsRepository";

/**
 * Extend this class when the multi update can be made with a simple MongoDB Query
 */
export abstract class ATransactionalMongoPatch implements IMongoPatchApplier, IMongoPatch {
    protected thUtils: ThUtils;

    protected hotelRepository: MongoHotelRepository;
    protected bedRepository: MongoBedRepository;
    protected addOnProductRepository: MongoAddOnProductRepository;
    protected priceProductRepository: MongoPriceProductRepository;
    protected customerRepository: MongoCustomerRepository;
    protected legacyInvoiceGroupsRepository: LegacyMongoInvoiceGroupsRepository;
    protected invoiceRepository: MongoInvoiceRepositoryWithBookingPriceLink;
    protected bookingRepository: MongoBookingRepository;
    protected settingsRepository: MongoSettingsRepository;

    constructor() {
        this.thUtils = new ThUtils();

        this.hotelRepository = new MongoHotelRepository();
        this.bedRepository = new MongoBedRepository();
        this.addOnProductRepository = new MongoAddOnProductRepository();
        this.priceProductRepository = new MongoPriceProductRepository();
        this.customerRepository = new MongoCustomerRepository();
        this.legacyInvoiceGroupsRepository = new LegacyMongoInvoiceGroupsRepository(this.hotelRepository);
        this.invoiceRepository = new MongoInvoiceRepositoryWithBookingPriceLink(new MongoInvoiceRepository(new MongoHotelRepository()), new MongoBookingRepository(), new MongoCustomerRepository());
        this.bookingRepository = new MongoBookingRepository();
        this.settingsRepository = new MongoSettingsRepository();
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
