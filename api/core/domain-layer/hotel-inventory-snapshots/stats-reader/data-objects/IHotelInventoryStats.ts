import { ITotalInventoryForDate } from './total-inventory/ITotalInventoryForDate';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { IRevenueForDate } from './revenue/IRevenueForDate';

export interface HotelInventoryStatsForDate {
    totalInventory: ITotalInventoryForDate;
    confirmedOccupancy: IBookingOccupancy;
    guaranteedOccupancy: IBookingOccupancy;
    guaranteedOccupancyOccupyingRoomsFromInventory: IBookingOccupancy;
    confirmedRevenue: IRevenueForDate;
    guaranteedRevenue: IRevenueForDate;
}

export interface IHotelInventoryStats {
    getInventoryStatsForDate(thDate: ThDateDO): HotelInventoryStatsForDate;
}