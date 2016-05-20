import {AppContext} from '../../../../utils/AppContext';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestamp} from '../../../../utils/th-dates/ThTimestamp';

export interface JobExecutorDO {
	appContext: AppContext;
	hotel?: HotelDO;
	thTimestamp?: ThTimestamp;
}