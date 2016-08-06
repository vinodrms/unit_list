import {DepartureItemInfoDO, DepartureItemBookingStatus} from '../data-objects/DepartureItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';
import {CurrencyDO} from '../../../../common/data-objects/currency/CurrencyDO';
import {RoomCategoryDO} from '../../../../room-categories/data-objects/RoomCategoryDO';

export class DepartureItemInfoVM {
    private _departureItemDO: DepartureItemInfoDO;
    private _hasInvoice: boolean;
    private _hasBooking: boolean;
    private _hasAttachedRoom: boolean;
    private _attachedRoomVM: RoomVM;
    private _roomCategory: RoomCategoryDO;
    private _currency: CurrencyDO;

    constructor(private _thTranslation: ThTranslation) {
    }

    public get departureItemDO(): DepartureItemInfoDO {
        return this._departureItemDO;
    }
    public set departureItemDO(departureItemDO: DepartureItemInfoDO) {
        this._departureItemDO = departureItemDO;
    }
    public get hasInvoice(): boolean {
        return this._hasInvoice;
    }
    public set hasInvoice(hasInvoice: boolean) {
        this._hasInvoice = hasInvoice;
    }
    public get hasBooking(): boolean {
        return this._hasBooking;
    }
    public set hasBooking(hasBooking: boolean) {
        this._hasBooking = hasBooking;
    }
    public get hasAttachedRoom(): boolean {
        return this._hasAttachedRoom;
    }
    public set hasAttachedRoom(hasAttachedRoom: boolean) {
        this._hasAttachedRoom = hasAttachedRoom;
    }
    public get attachedRoomVM(): RoomVM {
        return this._attachedRoomVM;
    }
    public set attachedRoomVM(attachedRoomVM: RoomVM) {
        this._attachedRoomVM = attachedRoomVM;
    }
    public get roomCategory(): RoomCategoryDO {
        return this._roomCategory;
    }
    public set roomCategory(roomCategory: RoomCategoryDO) {
        this._roomCategory = roomCategory;
    }
    public get currency(): CurrencyDO {
        return this._currency;
    }
    public set currency(currency: CurrencyDO) {
        this._currency = currency;
    }

    public get canCheckOut(): boolean {
        return this._departureItemDO.bookingItemStatus === DepartureItemBookingStatus.CanCheckOut;
    }

    public get roomName(): string {
        return this._attachedRoomVM.room.name;
    }

    public get customerName(): string {
        return this._departureItemDO.customerName;
    }

    public get roomCategoryLabel(): string {
        if (!this._roomCategory) { return ""; }
        return this._roomCategory.displayName;
    }

    public get numberOfPeople(): number {
        return this.departureItemDO.bookingCapacity.noAdults + this.departureItemDO.bookingCapacity.noChildren;
    }

    public get numberOfNights(): number {
        return this.departureItemDO.bookingInterval.getNumberOfDays();
    }

    public get priceString(): string {
        return this._departureItemDO.invoicePrice + this.currency.nativeSymbol;
    }
}