import { ITotalInventoryForDate } from './total-inventory/ITotalInventoryForDate';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { IRevenueForDate } from './revenue/IRevenueForDate';
import { ISegmentedRevenueForDate, RevenueSegment } from "./revenue/ISegmentedRevenueForDate";
import { ITotalGuestsForDate } from "./total-guests/ITotalGuestsForDate";

export interface HotelInventoryStatsForDate {
    date: ThDateDO;
    totalInventory: ITotalInventoryForDate;
    confirmedGuestNights: ITotalGuestsForDate;
    guaranteedGuestNights: ITotalGuestsForDate;
    confirmedOccupancy: IBookingOccupancy;
    guaranteedOccupancy: IBookingOccupancy;
    guaranteedOccupancyOccupyingRoomsFromInventory: IBookingOccupancy;
    confirmedRevenue: { [index: number]: ISegmentedRevenueForDate; };
    confirmedRevenueWithoutCommission: { [index: number]: ISegmentedRevenueForDate; };
    guaranteedRevenue: { [index: number]: ISegmentedRevenueForDate; };
    guaranteedRevenueWithoutCommission: { [index: number]: ISegmentedRevenueForDate; };
}

export interface IHotelInventoryStats {
    getInventoryStatsForDate(thDate: ThDateDO): HotelInventoryStatsForDate;
}