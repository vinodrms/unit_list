import {KeyMetricMeta} from './KeyMetricMeta';
import {KeyMetricType} from '../../data-objects/result-item/KeyMetricType';

export class KeyMetricMetaFactory {
    private static KeyMetricMetaList: KeyMetricMeta[] = [
        {
            type: KeyMetricType.TotalOccupancy,
            displayName: "Total Occupancy",
            measureUnit: "%",
            fontName: "8"
        },
        {
            type: KeyMetricType.ConfirmedOccupancy,
            displayName: "Confirmed Occupancy",
            measureUnit: "%",
            fontName: "8"
        },
        {
            type: KeyMetricType.TotalRevPar,
            displayName: "Total RevPar",
            measureUnit: "",
            fontName: "L"
        },
        {
            type: KeyMetricType.ConfirmedRevPar,
            displayName: "Confirmed RevPar",
            measureUnit: "",
            fontName: "L"
        },
        {
            type: KeyMetricType.TotalAvgRate,
            displayName: "Total AvgRate",
            measureUnit: "",
            fontName: "L"
        },
        {
            type: KeyMetricType.ConfirmedAvgRate,
            displayName: "Confirmed AvgRate",
            measureUnit: "",
            fontName: "L"
        },
        {
            type: KeyMetricType.Rooms,
            displayName: "Rooms",
            measureUnit: "Available Rooms",
            fontName: "@"
        },
        {
            type: KeyMetricType.Allotments,
            displayName: "Allotments",
            measureUnit: "Available Allotments",
            fontName: "â"
        },
        {
            type: KeyMetricType.RoomRevenue,
            displayName: "Room Revenue",
            measureUnit: "",
            fontName: "L"
        },
        {
            type: KeyMetricType.OtherRevenue,
            displayName: "Other Revenue",
            measureUnit: "",
            fontName: "L"
        }
    ];

    public getKeyMetricMetaByType(type: KeyMetricType): KeyMetricMeta {
        return _.find(KeyMetricMetaFactory.KeyMetricMetaList, (keyMetricMeta: KeyMetricMeta) => {
            return keyMetricMeta.type === type;
        });
    }
}