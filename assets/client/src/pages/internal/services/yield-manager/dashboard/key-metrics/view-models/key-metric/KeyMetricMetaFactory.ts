import {KeyMetricMeta} from './KeyMetricMeta';
import {KeyMetricType} from '../../data-objects/result-item/KeyMetricType';

export class KeyMetricMetaFactory {
    private static KeyMetricMetaList: KeyMetricMeta[] = [
        {
            type: KeyMetricType.TotalOccupancy,
            displayName: "Total Occupancy",
            measureUnit: "%",
            fontName: "Q"
        },
        {
            type: KeyMetricType.ConfirmedOccupancy,
            displayName: "Confirmed Occupancy",
            measureUnit: "%",
            fontName: "Q"
        },
        {
            type: KeyMetricType.TotalRevPar,
            displayName: "Total RevPar",
            measureUnit: "",
            fontName: "O"
        },
        {
            type: KeyMetricType.ConfirmedRevPar,
            displayName: "Confirmed RevPar",
            measureUnit: "",
            fontName: "O"
        },
        {
            type: KeyMetricType.TotalAvgRate,
            displayName: "Total AvgRate",
            measureUnit: "",
            fontName: "R"
        },
        {
            type: KeyMetricType.ConfirmedAvgRate,
            displayName: "Confirmed AvgRate",
            measureUnit: "",
            fontName: "R"
        },
        {
            type: KeyMetricType.Rooms,
            displayName: "Rooms",
            measureUnit: "",
            fontName: "@"
        },
        {
            type: KeyMetricType.Allotments,
            displayName: "Allotments",
            measureUnit: "",
            fontName: "â"
        },
        {
            type: KeyMetricType.RoomRevenue,
            displayName: "Room Revenue",
            measureUnit: "",
            fontName: "S"
        },
        {
            type: KeyMetricType.OtherRevenue,
            displayName: "Other Revenue",
            measureUnit: "",
            fontName: "T"
        }
    ];

    public getKeyMetricMetaByType(type: KeyMetricType): KeyMetricMeta {
        return _.find(KeyMetricMetaFactory.KeyMetricMetaList, (keyMetricMeta: KeyMetricMeta) => {
            return keyMetricMeta.type === type;
        });
    }
}