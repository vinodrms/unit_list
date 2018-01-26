import { IRoomRateDetailsPerDate } from "./IRoomRateDetailsPerDate";

export interface IAvailabilityRequest {
    username: string;
    password: string;
    hotel_id: string;
    version?: string;
    room: IRoomRateDetailsPerDate[];
}
