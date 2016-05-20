import {BaseDO} from '../../base/BaseDO';

export class NotificationDO extends BaseDO {
	id: string;
    hotelId: string;
    userId: string;
    code: string;
    parameterMap: Object = {};
    timestamp: number;
	delivered: boolean = false;
    
	protected getPrimitivePropertyKeys(): string[] {
        // Note: even though parameterMap is not of a primitive type, we want
        // it copied "as-is" (without any transformation). Hence, add it to this
        // list.
		return [
            "id", "hotelId", "userId", "code", "parameterMap", 
            "timestamp", "delivered"];
	}
}