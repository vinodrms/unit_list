import {BookingOccupancyDO} from './BookingOccupancyDO';

export interface IBookingOccupancy {
    getOccupancyForRoomCategoryId(roomCategoryId: string): number;
    getOccupancyForRoomId(roomId: string): number;
    getTotalRoomOccupancy(): number;

    getOccupancyForAllotmentId(allotmentId: string): number;
    getTotalAllotmentOccupancy(): number;

    getBookingOccupancyDO(): BookingOccupancyDO;
}