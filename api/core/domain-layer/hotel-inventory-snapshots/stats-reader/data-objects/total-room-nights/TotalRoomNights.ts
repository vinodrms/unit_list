import { ITotalRoomNights } from "./ITotalRoomNights";

export class TotalRoomNightsForDate implements ITotalRoomNights {
    
    private _totalRoomNights: number;
    private _roomNightsByBookingSegment: { [bookingSegment: number]: number; };

    public get totalRoomNights(): number {
        return this._totalRoomNights;
    }
    public set totalRoomNights(totalRoomNights: number) {
        this._totalRoomNights = totalRoomNights;
    }
    public get roomNightsByBookingSegment(): { [bookingSegment: number]: number; } {
        return this._roomNightsByBookingSegment;
    }
    public set roomNightsByBookingSegment(roomNightsByBookingSegment: { [bookingSegment: number]: number; }) {
        this._roomNightsByBookingSegment = roomNightsByBookingSegment;
    }
}

