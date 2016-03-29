import {ThError} from '../../../utils/th-responses/ThError';
import {RoomCategoryDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryDO';

export interface IRoomCategoryItemActionStrategy {
	save(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void });
}