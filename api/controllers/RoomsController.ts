import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';

class RoomsController extends BaseController {
	
    public getRoomList(req: Express.Request, res: Express.Response) {
		
	}
}

var roomsController = new RoomsController();
module.exports = {
	getRoomList: roomsController.getRoomList.bind(roomsController)
}