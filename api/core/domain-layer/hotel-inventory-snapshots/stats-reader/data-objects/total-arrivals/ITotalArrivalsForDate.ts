export interface ITotalArrivalsForDate {
    totalNoOfArrivals: number;
    
    arrivalsByNationality: { [countryCode: string]: number; };
}