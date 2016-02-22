import {ThError} from '../../../../utils/th-responses/ThError';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {HotelMetaRepoDO} from '../../../../data-layer/hotel/repositories/IHotelRepository';

export interface ITaxItemActionStrategy {
	validateAsync(finishedValidatingTaxItemCallback: { (err: ThError, success?: boolean): void; });
	saveAsync(hotelMeta: HotelMetaRepoDO, finishedSavingTaxItemCallback: { (err: ThError, updatedHotel?: HotelDO): void; });
}