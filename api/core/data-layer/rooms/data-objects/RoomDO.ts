import {BaseDO} from '../../common/base/BaseDO';
import {DocumentHistoryDO} from '../../common/data-objects/document-history/DocumentHistoryDO';
import {DocumentActionDO} from '../../common/data-objects/document-history/DocumentActionDO';

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

var RoomMaintenanceStatusDisplayStrings: { [index: number]: string; } = {};
RoomMaintenanceStatusDisplayStrings[RoomMaintenanceStatus.Clean] = "Clean";
RoomMaintenanceStatusDisplayStrings[RoomMaintenanceStatus.Dirty] = "Dirty";
RoomMaintenanceStatusDisplayStrings[RoomMaintenanceStatus.PickUp] = "Pick Up";
RoomMaintenanceStatusDisplayStrings[RoomMaintenanceStatus.OutOfOrder] = "Out Of Order";
RoomMaintenanceStatusDisplayStrings[RoomMaintenanceStatus.OutOfService] = "Out Of Service";

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

    public logCurrentMaintenanceHistory(documentAction: DocumentActionDO) {
        documentAction.tag = this.maintenanceStatus;
        this.maintenanceHistory.logDocumentAction(documentAction);
    }
    public getMaintenanceStatusDisplayString(): string {
        return RoomMaintenanceStatusDisplayStrings[this.maintenanceStatus];
    }
}