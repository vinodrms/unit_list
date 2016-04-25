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
            iconUrl: "Õ"
        },
        {
            name: "Park View",
            iconUrl: "Ö"
        },
        {
            name: "Sea View",
            iconUrl: "×"
        },
        {
            name: "Courtyard View",
            iconUrl: "Ø"
        },
        {
            name: "Near Elevator",
            iconUrl: "Ù"
        },
        {
            name: "Wheelchair Friendly",
            iconUrl: "Ú"
        },
        {
            name: "Smoking",
            iconUrl: "Û"
        },
        {
            name: "Non-Smoking",
            iconUrl: "Ü"
        },
        {
            name: "Balcony",
            iconUrl: "Þ"
        },
        {
            name: "Terrace",
            iconUrl: "à"
        },
        {
            name: "Garden Access",
            iconUrl: "ß"
        },
        {
            name: "Pool Access",
            iconUrl: "Ý"
        },
        {
            name: "Allergy Friendly",
            iconUrl: "á"
        }
    ];

}