import { DepartureItemInfoDO, DepartureItemBookingStatus } from '../data-objects/DepartureItemInfoDO';
import { RoomVM } from '../../../../rooms/view-models/RoomVM';
import { ThTranslation } from '../../../../../../../common/utils/localization/ThTranslation';
import { CurrencyDO } from '../../../../common/data-objects/currency/CurrencyDO';
import { RoomCategoryDO } from '../../../../room-categories/data-objects/RoomCategoryDO';
import { ThUtils } from "../../../../../../../common/utils/ThUtils";

export class DepartureItemInfoVM {
    private _departureItemDOList: DepartureItemInfoDO[];
    private _bookingDepartureItem: DepartureItemInfoDO;

    private _hasInvoice: boolean;
    private _hasBooking: boolean;
    private _hasAttachedRoom: boolean;
    private _attachedRoomVM: RoomVM;
    private _roomCategory: RoomCategoryDO;
    private _currency: CurrencyDO;

    constructor(private _thTranslation: ThTranslation) {
    }

    public get departureItemDOList(): DepartureItemInfoDO[] {
        return this._departureItemDOList;
    }
    public set departureItemDOList(departureItemDOList: DepartureItemInfoDO[]) {
        this._departureItemDOList = departureItemDOList;
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

    public get bookingDepartureItem(): DepartureItemInfoDO {
        return this._bookingDepartureItem;
    }

    public set bookingDepartureItem(bookingDepartureItem: DepartureItemInfoDO) {
        this._bookingDepartureItem = bookingDepartureItem;
    }

    private get departureItemContainingCustomerInfo(): DepartureItemInfoDO {
        return this.hasBooking? this.bookingDepartureItem : this.departureItemDOList[0];
    }

    public get canCheckOut(): boolean {
        return this.hasBooking? this.bookingDepartureItem.bookingItemStatus === DepartureItemBookingStatus.CanCheckOut : false;
    }

    public get roomName(): string {
        return this._attachedRoomVM.room.name;
    }

    public get customerName(): string {
        return this.departureItemContainingCustomerInfo.customerName;
    }

    public get corporateCustomerName(): string {
        return this.departureItemContainingCustomerInfo.corporateCustomerName;
    }

    public get roomCategoryLabel(): string {
        if (!this._roomCategory) { return ""; }
        return this._roomCategory.displayName;
    }

    public get numberOfPeople(): number {
        return this.bookingDepartureItem.bookingCapacity.noAdults + this.bookingDepartureItem.bookingCapacity.noChildren;
    }

    public get numberOfNights(): number {
        return this.bookingDepartureItem.bookingInterval.getNumberOfDays();
    }

    public get priceString(): string {
        return this.departureItemContainingCustomerInfo.invoicePrice + this.currency.nativeSymbol;
    }
}