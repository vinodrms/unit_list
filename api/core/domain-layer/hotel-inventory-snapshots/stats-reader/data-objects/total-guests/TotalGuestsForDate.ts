import { ITotalGuestsForDate } from "./ITotalGuestsForDate";

export class TotalGuestsForDate implements ITotalGuestsForDate {
    private _noOfGuests: number;
    private _guestsByNationality: { [countryCode: string]: number; }

    public get noOfGuests(): number {
        return this._noOfGuests;
    }
    public set noOfGuests(noOfGuests: number) {
        this._noOfGuests = noOfGuests;
    }

    public get guestsByNationality(): { [countryCode: string]: number; } {
        return this._guestsByNationality;
    }
    public set guestsByNationality(guestsByNationality: { [countryCode: string]: number; }) {
        this._guestsByNationality = guestsByNationality;
    }
}

