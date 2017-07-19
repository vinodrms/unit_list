import { ITotalInventoryForDate } from './total-inventory/ITotalInventoryForDate';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { IRevenueForDate } from './revenue/IRevenueForDate';
import { ISegmentedRevenueForDate } from "./revenue/ISegmentedRevenueForDate";
import { ITotalGuestsForDate } from "./total-guests/ITotalGuestsForDate";
import { ITotalArrivalsForDate } from "./total-arrivals/ITotalArrivalsForDate";
import { ITotalRoomNights } from "./total-room-nights/ITotalRoomNights";
import { ISegmentedCostForDate } from "./cost/ISegmentedCostForDate";

export interface HotelInventoryStatsForDate {
    date: ThDateDO;
    totalInventory: ITotalInventoryForDate;
    confirmedGuestNights: ITotalGuestsForDate;
    guaranteedGuestNights: ITotalGuestsForDate;
    confirmedArrivals: ITotalArrivalsForDate;
    guaranteedArrivals: ITotalArrivalsForDate;
    confirmedRoomNights: ITotalRoomNights;
    guaranteedRoomNights: ITotalRoomNights;
    confirmedOccupancy: IBookingOccupancy;
    guaranteedOccupancy: IBookingOccupancy;
    guaranteedOccupancyOccupyingRoomsFromInventory: IBookingOccupancy;
    confirmedRevenue: { [index: number]: ISegmentedRevenueForDate; };
    confirmedRevenueWithoutCommission: { [index: number]: ISegmentedRevenueForDate; };
    guaranteedRevenue: { [index: number]: ISegmentedRevenueForDate; };
    guaranteedRevenueWithoutCommission: { [index: number]: ISegmentedRevenueForDate; };
    breakfastInternalCost:  { [index: number]: ISegmentedCostForDate };
}

export interface IHotelInventoryStats {
    getInventoryStatsForDate(thDate: ThDateDO): HotelInventoryStatsForDate;
}