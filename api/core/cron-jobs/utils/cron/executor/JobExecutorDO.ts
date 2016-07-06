import {AppContext} from '../../../../utils/AppContext';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';

export interface JobExecutorDO {
	appContext: AppContext;
	hotel?: HotelDO;
	thTimestamp?: ThTimestampDO;
}