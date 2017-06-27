export interface ITotalGuestsForDate {
    totalNoOfGuests: number;
    
    guestsByBookingSegment: { [bookingSegment: number]: number; };
    guestsByNationality: { [countryCode: string]: number; };
}