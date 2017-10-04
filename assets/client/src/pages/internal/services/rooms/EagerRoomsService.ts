import * as _ from "underscore";
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { Observable } from "rxjs/Observable";
import { RoomsDO } from "./data-objects/RoomsDO";

@Injectable()
export class EagerRoomsService {

    constructor(private context: AppContext) { }

    public getRoomsByIds(roomIdList: string[]): Observable<RoomsDO> {
        if (!roomIdList || roomIdList.length == 0) {
            let rooms = new RoomsDO();
            rooms.roomList = [];
            return Observable.from([rooms]);
        }
        return this.context.thHttp.post({
            serverApi: ThServerApi.Rooms,
            body: JSON.stringify({
                searchCriteria: {
                    roomIdList: roomIdList
                }
            })
        }).map((roomsObject: Object) => {
            var rooms = new RoomsDO();
            rooms.buildFromObject(roomsObject);
            return rooms;
        });
    }
}
