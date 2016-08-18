import {PriceProductYieldItemVM} from '../../../../../../../../../../services/yield-manager/dashboard/price-products/view-models/PriceProductYieldItemVM';
import {ThDateDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';

export interface IYieldStateModel{
	priceProduct : PriceProductYieldItemVM,
	date : ThDateDO,
	stateIndex: number
}