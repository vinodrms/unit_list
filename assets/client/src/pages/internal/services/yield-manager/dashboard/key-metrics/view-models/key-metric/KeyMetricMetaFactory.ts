import {KeyMetricMeta} from './KeyMetricMeta';
import {KeyMetricType} from '../../data-objects/result-item/KeyMetricType';

export class KeyMetricMetaFactory {
    private static KeyMetricMetaList: KeyMetricMeta[] = [
        {
            type: KeyMetricType.TotalOccupancy,
            displayName: "Total Occupancy",
            fontName: "8"
        },
        {
            type: KeyMetricType.ConfirmedOccupancy,
            displayName: "Confirmed Occupancy",
            fontName: "8"
        },
        {
            type: KeyMetricType.TotalRevPar,
            displayName: "Total RevPar",
            fontName: "L"
        },
        {
            type: KeyMetricType.ConfirmedRevPar,
            displayName: "Confirmed RevPar",
            fontName: "L"
        },
        {
            type: KeyMetricType.TotalAvgRate,
            displayName: "Total AvgRate",
            fontName: "L"
        },
        {
            type: KeyMetricType.ConfirmedAvgRate,
            displayName: "Confirmed AvgRate",
            fontName: "L"
        },
        {
            type: KeyMetricType.Rooms,
            displayName: "Rooms",
            fontName: "@"
        },
        {
            type: KeyMetricType.Allotments,
            displayName: "Allotments",
            fontName: "â"
        },
        {
            type: KeyMetricType.RoomRevenue,
            displayName: "Room Revenue",
            fontName: "L"
        },
        {
            type: KeyMetricType.OtherRevenue,
            displayName: "Other Revenue",
            fontName: "L"
        }
    ];

    public getKeyMetricMetaByType(type: KeyMetricType): KeyMetricMeta {
        return _.find(KeyMetricMetaFactory.KeyMetricMetaList, (keyMetricMeta: KeyMetricMeta) => {
            return keyMetricMeta.type === type;
        });
    }
}