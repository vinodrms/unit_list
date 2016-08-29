import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {HotelDO} from '../../../../data-layer/hotel/data-objects/HotelDO';
import {RoomDO, RoomMaintenanceStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {RoomSearchResultRepoDO} from '../../../../data-layer/rooms/repositories/IRoomRepository';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class MarkOccupiedCleanRoomsAsDirtyProcess {
    constructor(private _appContext: AppContext, private _hotel: HotelDO) {
    }

    public runProcess(): Promise<RoomDO[]> {
        return new Promise<RoomDO[]>((resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) => {
            this.runProcessCore(resolve, reject);
        });
    }
    private runProcessCore(resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) {
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingList({ hotelId: this._hotel.id }, {
            confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId
        }).then((bookingsSearchResult: BookingSearchResultRepoDO) => {
            var bookingList: BookingDO[] = bookingsSearchResult.bookingList;
            var roomIdList = this.getUniqueRoomIdList(bookingList);

            return this.markRoomsAsOccupied(roomIdList);
        }).then((updatedRoomList: RoomDO[]) => {
            resolve(updatedRoomList);
        }).catch((error: any) => {
            reject(error);
        });
    }

    private getUniqueRoomIdList(bookingList: BookingDO[]): string[] {
        var roomIdList: string[] = _.map(bookingList, (booking: BookingDO) => { return booking.roomId });
        return _.uniq(roomIdList);
    }

    private markRoomsAsOccupied(roomIdList: string[]): Promise<RoomDO[]> {
        return new Promise<RoomDO[]>((resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }) => {
            this.markRoomsAsOccupiedCore(resolve, reject, roomIdList);
        });
    }
    private markRoomsAsOccupiedCore(resolve: { (result: RoomDO[]): void }, reject: { (err: ThError): void }, roomIdList: string[]) {
        if (roomIdList.length == 0) {
            resolve([]);
            return;
        }

        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        return roomsRepo.getRoomList({ hotelId: this._hotel.id }, { roomIdList: roomIdList, maintenanceStatusList: [RoomMaintenanceStatus.Clean] })
            .then((roomSearchResult: RoomSearchResultRepoDO) => {
                var roomList: RoomDO[] = roomSearchResult.roomList;
                this.updateRoomListAsDirty(roomList);

                var promiseList: Promise<RoomDO>[] = [];
                _.forEach(roomList, (room: RoomDO) => {
                    var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                    promiseList.push(roomsRepo.updateRoom({ hotelId: this._hotel.id }, {
                        id: room.id,
                        versionId: room.versionId
                    }, room));
                });
                return Promise.all(promiseList);
            }).then((updatedRoomList: RoomDO[]) => {
                resolve(updatedRoomList);
            }).catch((error: any) => {
                reject(error);
            });
    }

    private updateRoomListAsDirty(roomList: RoomDO[]) {
        _.forEach(roomList, (room: RoomDO) => {
            this.updateRoomAsDirty(room);
        });
    }
    private updateRoomAsDirty(room: RoomDO) {
        room.maintenanceStatus = RoomMaintenanceStatus.Dirty;
        room.maintenanceMessage = "";

        var maintenanceAction = DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: "The room was marked as Dirty (Occupied)"
        });
        room.logCurrentMaintenanceHistory(maintenanceAction);
    }
}