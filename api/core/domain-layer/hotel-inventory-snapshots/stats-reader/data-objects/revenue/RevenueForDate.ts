export class RevenueForDate {
    private _roomRevenue: number;
    private _otherRevenue: number;

    constructor(roomRevenue: number, otherRevenue: number) {
        this._roomRevenue = roomRevenue;
        this._otherRevenue = otherRevenue;
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

    public addRevenue(otherRevenue: RevenueForDate) {
        this._roomRevenue += otherRevenue.roomRevenue;
        this._otherRevenue += otherRevenue.otherRevenue;
    }
}