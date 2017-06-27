import { ITotalGuestsForDate } from "./ITotalGuestsForDate";

export class TotalGuestsForDate implements ITotalGuestsForDate {
    
    private _noOfGuests: number;

    private _guestsByBookingSegment: { [bookingSegment: number]: number; };
    private _guestsByNationality: { [countryCode: string]: number; };

    public get totalNoOfGuests(): number {
        return this._noOfGuests;
    }
    public set totalNoOfGuests(noOfGuests: number) {
        this._noOfGuests = noOfGuests;
    }
    public get guestsByBookingSegment(): { [bookingSegment: number]: number; } {
        return this._guestsByBookingSegment;
    }
    public set guestsByBookingSegment(guestsByBookingSegment: { [bookingSegment: number]: number; }) {
        this._guestsByBookingSegment = guestsByBookingSegment;
    }
    public get guestsByNationality(): { [countryCode: string]: number; } {
        return this._guestsByNationality;
    }
    public set guestsByNationality(guestsByNationality: { [countryCode: string]: number; }) {
        this._guestsByNationality = guestsByNationality;
    }
}

