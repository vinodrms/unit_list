import { BaseDO } from "../../../../../../../../../../../../../../common/base/BaseDO";

export class BookingDotComRoomConfigurationDO extends BaseDO {
    
    public ourRoomId: string;
    public roomId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["ourRoomId","roomId"];
    }
}

export class BookingDotComRoomConfigurationsDO extends BaseDO {
    roomConfigurations: BookingDotComRoomConfigurationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        this.roomConfigurations = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomConfigurations"), (roomConfigurationObject: Object) => {
            var roomConfigurationDO = new BookingDotComRoomConfigurationDO();
            roomConfigurationDO.buildFromObject(roomConfigurationObject);
            this.roomConfigurations.push(roomConfigurationDO);
        });
    }
}