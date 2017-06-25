import { ITotalInventoryForDate } from './total-inventory/ITotalInventoryForDate';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { IRevenueForDate } from './revenue/IRevenueForDate';
import { ISegmentedRevenueForDate, RevenueSegment } from "./revenue/ISegmentedRevenueForDate";

export interface HotelInventoryStatsForDate {
    totalInventory: ITotalInventoryForDate;
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