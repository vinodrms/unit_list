import {ABaseSetting} from './ABaseSetting';
import {SettingMetadataDO, SettingType} from '../../../../../../../data-layer/settings/data-objects/common/SettingMetadataDO';
import {RoomAttributeDO} from '../../../../../../../data-layer/common/data-objects/room-attribute/RoomAttributeDO';
import {RoomAttributeSettingDO} from '../../../../../../../data-layer/settings/data-objects/room-attribute/RoomAttributeSettingDO';

export class RoomAttributes extends ABaseSetting {

    constructor() {
        super(SettingType.RoomAttributes, "Room Attributes");
    }

    public getRoomAttributeSettingDO(): RoomAttributeSettingDO {
        var readRoomAttributes = this.dataSet;
        var toAddRoomAttributes: RoomAttributeDO[] = [];
        readRoomAttributes.forEach((readRoomAttribute: { name: string, iconUrl: string }) => {
            var roomAttributeDO = new RoomAttributeDO();
            roomAttributeDO.iconUrl = readRoomAttribute.iconUrl;
            roomAttributeDO.name = readRoomAttribute.name;
            roomAttributeDO.id = this._thUtils.generateUniqueID();
            toAddRoomAttributes.push(roomAttributeDO);
        });
        var roomAttributeSettingDO = new RoomAttributeSettingDO();
        roomAttributeSettingDO.metadata = this.getSettingMetadata();
        roomAttributeSettingDO.value = toAddRoomAttributes;
        return roomAttributeSettingDO;
    }

    private dataSet: { name: string, iconUrl: string }[] = [
        {
            name: "Street View",
            iconUrl: "glyphicon glyphicon-asterisk glyphicon-lg"
        },
        {
            name: "Park View",
            iconUrl: "glyphicon glyphicon-glass glyphicon-lg"
        },
        {
            name: "Sea View",
            iconUrl: "glyphicon glyphicon-th-large glyphicon-lg"
        },
        {
            name: "Courtyard View",
            iconUrl: "glyphicon glyphicon-signal glyphicon-lg"
        },
        {
            name: "Near Elevator",
            iconUrl: "glyphicon glyphicon-download glyphicon-lg"
        },
        {
            name: "Wheelchair Friendly",
            iconUrl: "glyphicon glyphicon-flag glyphicon-lg"
        },
        {
            name: "Smoking",
            iconUrl: "glyphicon glyphicon-tags glyphicon-lg"
        },
        {
            name: "Non-Smoking",
            iconUrl: "glyphicon glyphicon-floppy-save glyphicon-lg"
        },
        {
            name: "Balcony",
            iconUrl: "glyphicon glyphicon-phone-alt glyphicon-lg"
        },
        {
            name: "Terrace",
            iconUrl: "glyphicon glyphicon-tree-deciduous glyphicon-lg"
        },
        {
            name: "Garden Access",
            iconUrl: "glyphicon glyphicon-blackboard glyphicon-lg"
        },
        {
            name: "Pool Access",
            iconUrl: "glyphicon glyphicon-scissors glyphicon-lg"
        },
        {
            name: "Bay Window",
            iconUrl: "glyphicon glyphicon-oil glyphicon-lg"
        }
    ];

}