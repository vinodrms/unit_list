export interface IRoomRateDetailsPerDate {
    _attributes: { id: string };
    date: {
        _attributes: { value: string };
        rate?: { _attributes: { id: string } };
        roomstosell?: number;
        price?: number;
        price1?: number;
        closed?: number;
        minimumstay_arrival?: number;
        minimumstay?: number;
        maximumstay_arrival?: number;
        maximumstay?: number;
        exactstay?: number;
        exactstay_arrival?: number;
        closedonarrival?: number;
        closedondeparture?: number;
    }
}
