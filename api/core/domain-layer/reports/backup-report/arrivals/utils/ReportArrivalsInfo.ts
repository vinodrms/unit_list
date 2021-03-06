import { ThDateIntervalDO } from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';

import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus } from '../../../../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingItemDO } from '../../../../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { HotelOperationsArrivalsReader } from '../../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import { HotelOperationsArrivalsInfo, ArrivalItemInfo } from '../../../../../../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';

import { RoomCategoryDO } from '../../../../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import { RoomDO } from '../../../../../../core/data-layer/rooms/data-objects/RoomDO';

export interface ReportArrivalItemInfo {
	customerName: string;
	corporateCustomerName: string;
	roomCategory: string;
	roomNumber: string;
	interval: string;
	noNights: number;
	noAdults: number,
	noChildren: number,
	noBabies: number;
	noBabyBeds: number;
	bookingStatus: string;
	totalPrice: number;
	cancelationHours: string;
	notes: string;
}