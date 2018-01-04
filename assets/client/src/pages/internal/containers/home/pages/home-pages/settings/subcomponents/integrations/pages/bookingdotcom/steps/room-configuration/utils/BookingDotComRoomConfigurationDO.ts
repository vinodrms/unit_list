import { BaseDO } from "../../../../../../../../../../../../../../common/base/BaseDO";

export class BookingDotComRoomConfigurationDO extends BaseDO {
    
    public ourRoomCategoryId: string;
    public roomId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["ourRoomCategoryId","roomId"];
    }
}

export class BookingDotComRoomCategoryConfigurationsDO extends BaseDO {
    roomCategoryConfigurations: BookingDotComRoomConfigurationDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }

    public buildFromObject(object: Object) {
        this.roomCategoryConfigurations = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomCategoryConfigurations"), (roomCategoryConfigurationObject: Object) => {
            var roomCategoryConfigurationDO = new BookingDotComRoomConfigurationDO();
            roomCategoryConfigurationDO.buildFromObject(roomCategoryConfigurationObject);
            this.roomCategoryConfigurations.push(roomCategoryConfigurationDO);
        });
    }
}