export class NewBookingModalInput {
    private _groupBookingId: string;

    constructor() { }

    public set groupBookingId(groupBookingId: string) {
        this._groupBookingId = groupBookingId;
    }

    public get groupBookingId(): string {
        return this._groupBookingId;
    }
}