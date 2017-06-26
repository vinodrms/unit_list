export interface ITotalGuestsForDate {
    noOfGuests: number;
    guestsByNationality: { [countryCode: string]: number; }
}