export interface ITotalInventoryForDate {
    noOfRooms: number;
    noOfRoomsWithAllotment: number;
    getNumberOfRoomsFor(roomCategoryId: string): number;
}