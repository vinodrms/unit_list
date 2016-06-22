export interface IBookingOccupancy {
    getOccupancyForRoomCategoryId(roomCategoryId: string): number;
    getOccupancyForRoomId(roomId: string): number;
    getOccupancyForAllotmentId(allotmentId: string): number;
}