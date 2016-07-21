import {RoomVM} from '../../../../../../../services/rooms/view-models/RoomVM';
import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';
import {RoomAttributesDO} from '../../../../../../../services/settings/data-objects/RoomAttributesDO';
import {RoomAmenitiesDO} from '../../../../../../../services/settings/data-objects/RoomAmenitiesDO';

export class RoomPreviewInput {
    roomVM: RoomVM;
    bedVMList: BedVM[];
    allRoomAmenities: RoomAmenitiesDO;
    allRoomAttributes: RoomAttributesDO;
}