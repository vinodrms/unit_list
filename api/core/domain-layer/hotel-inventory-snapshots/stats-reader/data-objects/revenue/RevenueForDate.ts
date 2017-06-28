export class RevenueForDate {
    private _roomRevenue: number;
    private _otherRevenue: number;
    private _breakfastRevenue: number;

    constructor(roomRevenue: number, otherRevenue: number, breakfastRevenue: number) {
        this._roomRevenue = roomRevenue;
        this._otherRevenue = otherRevenue;
        this._breakfastRevenue = breakfastRevenue;
    }

    public get roomRevenue(): number {
        return this._roomRevenue;
    }
    public set roomRevenue(roomRevenue: number) {
        this._roomRevenue = roomRevenue;
    }
    public get otherRevenue(): number {
        return this._otherRevenue;
    }
    public set otherRevenue(otherRevenue: number) {
        this._otherRevenue = otherRevenue;
    }
    public get breakfastRevenue(): number {
        return this._breakfastRevenue;
    }
    public set breakfastRevenue(breakfastRevenue: number) {
        this._breakfastRevenue = breakfastRevenue;
    }
    public addRevenue(revenue: RevenueForDate) {
        this._roomRevenue += revenue.roomRevenue;
        this._otherRevenue += revenue.otherRevenue;
        this._breakfastRevenue += revenue.breakfastRevenue;
    }
}