import { ThError } from '../../../../../../utils/th-responses/ThError';
import { AppContext } from '../../../../../../utils/AppContext';
import { SessionContext } from '../../../../../../utils/SessionContext';
import { BookingSearchDependencies } from '../results/BookingSearchDependencies';
import { ABookingDataLoader } from '../ABookingDataLoader';
import { PriceProductStatus, PriceProductAvailability } from '../../../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductSearchResultRepoDO } from '../../../../../../data-layer/price-products/repositories/IPriceProductRepository';

export class PublicBookingDataLoader extends ABookingDataLoader {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        super();
    }

    protected loadDataCore(resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void }) {
        var priceProductsRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        priceProductsRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id },
            {
                status: PriceProductStatus.Active,
                availability: PriceProductAvailability.Public
            }).then((priceProductSearchResult: PriceProductSearchResultRepoDO) => {
                resolve(new BookingSearchDependencies(priceProductSearchResult.priceProductList, []));
            }).catch((error: any) => {
                reject(error);
            });
    }
}