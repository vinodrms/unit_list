import {ThError} from '../../../utils/th-responses/ThError';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';

export interface IRoomItemActionStrategy {
	save(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void });
}