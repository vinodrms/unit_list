import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';

import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';

import { RoomCategoryDO } from '../../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';

export interface ReportInHouseItemInfo {
	customerName: string;
	roomNumber: string;
	noAdults: number,
	noChildren : number,
	noBabies: number;
	departingDate: ThDateDO;
	notes: string;
}