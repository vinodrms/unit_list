export interface ITotalRoomNights {
    totalRoomNights: number;
    
    roomNightsByBookingSegment: { [bookingSegment: number]: number; };
}