import {ThError} from '../../../../../utils/th-responses/ThError';
import {SessionContext} from '../../../../../utils/SessionContext';
import {IAssignRoomStrategy, AssignRoomValidationDO} from './IAssignRoomStrategy';
import {BookingDO} from '../../../../../data-layer/bookings/data-objects/BookingDO';
import {DocumentActionDO} from '../../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import {RoomDO} from '../../../../../data-layer/rooms/data-objects/RoomDO';
import {RoomCategoryStatsDO} from '../../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {ThUtils} from '../../../../../utils/ThUtils';

import _ = require('underscore');

export abstract class AAssignRoomStrategy implements IAssignRoomStrategy {
    protected _thUtils: ThUtils;

    constructor(protected _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public updateAdditionalFields(validationDO: AssignRoomValidationDO): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.updateAdditionalFieldsCore(resolve, reject, validationDO);
        });
    }
    protected abstract updateAdditionalFieldsCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, validationDO: AssignRoomValidationDO);

    protected logRoomChangedOnBooking(bookingDO: BookingDO, logMessageWithRoomNameParam: string, roomList: RoomDO[]) {
        var room = _.find(roomList, (room: RoomDO) => { return room.id === bookingDO.roomId });
        if (this._thUtils.isUndefinedOrNull(room)) {
            return;
        }
        bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { roomName: room.name },
            actionString: logMessageWithRoomNameParam,
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    public abstract validateAlreadyCheckedInBooking(): boolean;
    public generateInvoiceIfNecessary(booking: BookingDO): Promise<BookingDO> {
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.generateInvoiceIfNecessaryCore(resolve, reject, booking);
        });
    }
    protected abstract generateInvoiceIfNecessaryCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }, booking: BookingDO);

    protected updateRollawayBedStatusOnBooking(validationDO: AssignRoomValidationDO): RoomCategoryStatsDO {
        validationDO.booking.needsRollawayBeds = false;

        var room = _.find(validationDO.roomList, (room: RoomDO) => { return room.id === validationDO.booking.roomId });
        if (this._thUtils.isUndefinedOrNull(room)) {
            return;
        }

        var roomCategoryStats = _.find(validationDO.roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
            return roomCategoryStats.roomCategory.id === room.categoryId;
        });
        if (this._thUtils.isUndefinedOrNull(roomCategoryStats)) {
            return;
        }
        if (!roomCategoryStats.capacity.canFitInStationaryBeds(validationDO.booking.configCapacity)) {
            validationDO.booking.needsRollawayBeds = true;
        }
    }
}