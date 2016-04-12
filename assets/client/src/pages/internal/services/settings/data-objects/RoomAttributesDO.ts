import {BaseDO} from '../../../../../common/base/BaseDO';
import {RoomAttributeDO} from '../../common/data-objects/room-attribute/RoomAttributeDO';

export class RoomAttributesDO extends BaseDO {
	roomAttributeList: RoomAttributeDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.roomAttributeList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "roomAttributeList"), (roomAttributeObject: Object) => {
			var roomAttributeDO = new RoomAttributeDO();
			roomAttributeDO.buildFromObject(roomAttributeObject);
			this.roomAttributeList.push(roomAttributeDO);
		});
	}
}