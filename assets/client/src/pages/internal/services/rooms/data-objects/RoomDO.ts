import {BaseDO} from '../../../../../common/base/BaseDO';
import {DocumentHistoryDO} from '../../common/data-objects/document-history/DocumentHistoryDO';

export enum RoomStatus {
    Active,
    Deleted
}

export enum RoomMaintenanceStatus {
    Clean,
    Dirty,
    PickUp,
    OutOfOrder,
    OutOfService
}

export class RoomDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    versionId: number;
    hotelId: string;
    name: string;
    floor: number;
    categoryId: string;
    amenityIdList: string[];
    attributeIdList: string[];
    fileUrlList: string[];
    description: string;
    notes: string;
    maintenanceStatus: RoomMaintenanceStatus;
    maintenanceMessage: string;
    maintenanceHistory: DocumentHistoryDO;
    status: RoomStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "name", "floor", "categoryId", "amenityIdList",
            "attributeIdList", "fileUrlList", "description", "notes", "maintenanceStatus", "maintenanceMessage", "status"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.maintenanceHistory = new DocumentHistoryDO();
        this.maintenanceHistory.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "maintenanceHistory"));
    }

    public static get inInventoryMaintenanceStatusList(): RoomMaintenanceStatus[] {
        return [
            RoomMaintenanceStatus.Clean,
            RoomMaintenanceStatus.Dirty,
            RoomMaintenanceStatus.PickUp,
            RoomMaintenanceStatus.OutOfOrder
        ];
    }
}