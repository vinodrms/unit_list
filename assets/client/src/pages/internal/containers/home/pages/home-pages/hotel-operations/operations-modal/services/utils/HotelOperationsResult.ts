export class HotelOperationsResult {
    private _didChangeRoom: boolean;
    private _didChangeBooking: boolean;
    private _didChangeInvoice: boolean;

    constructor() {
        this._didChangeRoom = false;
        this._didChangeBooking = false;
        this._didChangeInvoice = false;
    }

    public get didChangeRoom(): boolean {
        return this._didChangeRoom;
    }
    public set didChangeRoom(didChangeRoom: boolean) {
        this._didChangeRoom = didChangeRoom;
    }
    public get didChangeBooking(): boolean {
        return this._didChangeBooking;
    }
    public set didChangeBooking(didChangeBooking: boolean) {
        this._didChangeBooking = didChangeBooking;
    }
    public get didChangeInvoice(): boolean {
        return this._didChangeInvoice;
    }
    public set didChangeInvoice(didChangeInvoice: boolean) {
        this._didChangeInvoice = didChangeInvoice;
    }
}