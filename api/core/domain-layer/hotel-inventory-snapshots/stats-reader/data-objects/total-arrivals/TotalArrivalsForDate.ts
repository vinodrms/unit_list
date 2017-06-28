

import { ITotalArrivalsForDate } from "./ITotalArrivalsForDate";

export class TotalArrivalsForDate implements ITotalArrivalsForDate {
    
    private _totalNoOfArrivals: number;
    private _arrivalsByNationality: { [countryCode: string]: number; };

    public get totalNoOfArrivals(): number {
        return this._totalNoOfArrivals;
    }
    public set totalNoOfArrivals(totalNoOfArrivals: number) {
        this._totalNoOfArrivals = totalNoOfArrivals;
    }
    public get arrivalsByNationality(): { [countryCode: string]: number; } {
        return this._arrivalsByNationality;
    }
    public set arrivalsByNationality(arrivalsByNationality: { [countryCode: string]: number; }) {
        this._arrivalsByNationality = arrivalsByNationality;
    }
}

