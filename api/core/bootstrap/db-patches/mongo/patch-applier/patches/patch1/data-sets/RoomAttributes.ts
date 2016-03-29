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
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Park View",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Sea View",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Courtyard View",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Near Elevator",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Wheelchair Friendly",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Smoking",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Non-Smoking",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Balcony",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Terrace",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Garden Access",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Pool Access",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        },
        {
            name: "Bay Window",
            iconUrl: "http://res.cloudinary.com/hbpr8ossz/image/upload/v1455114119/iznokfvetygeaiqgyobe.png"
        }
    ];

}