import {KeyMetricMeta} from './KeyMetricMeta';
import {KeyMetricType} from '../../data-objects/result-item/KeyMetricType';

export class KeyMetricMetaFactory {
    private static KeyMetricMetaList: KeyMetricMeta[] = [
        {
            type: KeyMetricType.TotalOccupancy,
            measureUnit: "%",
            fontName: "Q"
        },
        {
            type: KeyMetricType.ConfirmedOccupancy,
            measureUnit: "%",
            fontName: "Q"
        },
        {
            type: KeyMetricType.TotalRevPar,
            measureUnit: "",
            fontName: "O"
        },
        {
            type: KeyMetricType.ConfirmedRevPar,
            measureUnit: "",
            fontName: "O"
        },
        {
            type: KeyMetricType.TotalAvgRate,
            measureUnit: "",
            fontName: "R"
        },
        {
            type: KeyMetricType.ConfirmedAvgRate,
            measureUnit: "",
            fontName: "R"
        },
        {
            type: KeyMetricType.Rooms,
            measureUnit: "",
            fontName: "@"
        },
        {
            type: KeyMetricType.Allotments,
            measureUnit: "",
            fontName: "â"
        },
        {
            type: KeyMetricType.RoomRevenue,
            measureUnit: "",
            fontName: "S"
        },
        {
            type: KeyMetricType.OtherRevenue,
            measureUnit: "",
            fontName: "T"
        },
        {
            type: KeyMetricType.ConfirmedRevenue,
            measureUnit: "",
            fontName: "U"
        },
        {
            type: KeyMetricType.RoomCategory,
            measureUnit: "",
            fontName: "@"
        }
    ];

    public getKeyMetricMetaByType(type: KeyMetricType): KeyMetricMeta {
        return _.find(KeyMetricMetaFactory.KeyMetricMetaList, (keyMetricMeta: KeyMetricMeta) => {
            return keyMetricMeta.type === type;
        });
    }
}