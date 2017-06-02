import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AppContext, ThError, ThServerApi } from '../../../../../../../../../../../common/utils/AppContext';
import { IBookingStepService } from '../../utils/IBookingStepService';
import { ILastBookingStepService } from '../../utils/ILastBookingStepService';
import { BookingStepType } from '../../utils/BookingStepType';
import { BookingCartService } from '../../../../services/search/BookingCartService';
import { TransientBookingItem } from '../../../../services/data-objects/TransientBookingItem';
import { BookingCartItemVM } from '../../../../services/search/view-models/BookingCartItemVM';
import { AddBookingItemsDO, EmailDistributionDO } from '../../../../services/data-objects/AddBookingItemsDO';
import { BookingDO } from "../../../../../../../../../services/bookings/data-objects/BookingDO";

@Injectable()
export class BookingEmailConfigStepService implements IBookingStepService, ILastBookingStepService {
    emailRecipientList: EmailDistributionDO[] = [];
    private _stepPath: string[];

    didAppearObservable: Observable<boolean>;
    private _didAppearObserver: Observer<boolean>;

    didDisappearObservable: Observable<boolean>;
    private _didDisappearObserver: Observer<boolean>;

    constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService) {
        this._stepPath = [this._appContext.thTranslation.translate("Recipients")];
        this.didAppearObservable = new Observable<boolean>((didAppearObserver: Observer<boolean>) => {
            this._didAppearObserver = didAppearObserver;
        });
        this.didDisappearObservable = new Observable<boolean>((didDisappearObserver: Observer<boolean>) => {
            this._didDisappearObserver = didDisappearObserver;
        });
    }

    public getBookingStepType(): BookingStepType {
        return BookingStepType.EmailConfig;
    }
    public canMoveNext(): boolean {
        return true;
    }
    public getStepPath(): string[] {
        return this._stepPath;
    }
    public getErrorString(): string {
        return "";
    }
    public didAppear() {
        if (this._didAppearObserver) { this._didAppearObserver.next(true) };
    }
    public didDisappear() {
        if (this._didDisappearObserver) { this._didDisappearObserver.next(true) };
    }

    public addBookings(): Observable<BookingDO[]> {
        return new Observable<BookingDO[]>((addBookingsObserver: Observer<BookingDO[]>) => {
            this.addBookingsCore(addBookingsObserver);
        });
    }
    private addBookingsCore(addBookingsObserver: Observer<BookingDO[]>) {
        var bookingItems = this.getAddBookingItemsDO();
        if (bookingItems.confirmationEmailList.length > 0) {
            this.postBookingsToServer(addBookingsObserver, bookingItems);
            return;
        }
        var title = this._appContext.thTranslation.translate("Booking Confirmation");
        var content = this._appContext.thTranslation.translate("Are you sure you want to add the bookings without sending email confirmations?");
        this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
            () => {
                this.postBookingsToServer(addBookingsObserver, bookingItems);
            }, () => {
                addBookingsObserver.complete();
            });
    }
    private postBookingsToServer(addBookingsObserver: Observer<BookingDO[]>, bookingItems: AddBookingItemsDO) {
        this._appContext.thHttp.post(ThServerApi.BookingsAdd, { bookingItems: bookingItems })
            .subscribe((result: any) => {
                this._appContext.analytics.logEvent("booking", "add", "Added " + bookingItems.bookingList.length + " bookings");
                addBookingsObserver.next(result.bookingList);
                addBookingsObserver.complete();
            }, (err: ThError) => {
                addBookingsObserver.error(err);
                addBookingsObserver.complete();
            });
    }

    private getAddBookingItemsDO(): AddBookingItemsDO {
        var bookingItems = new AddBookingItemsDO();
        bookingItems.groupBookingId = this._bookingCartService.groupBookingId;
        bookingItems.bookingList = this.getOnlyTheNewTransientBookingItems();
        bookingItems.confirmationEmailList = this.emailRecipientList;
        return bookingItems;
    }

    private getOnlyTheNewTransientBookingItems(): TransientBookingItem[] {
        return _.chain(this._bookingCartService.bookingItemVMList).filter((bookingItemVM: BookingCartItemVM) => {
            return this._appContext.thUtils.isUndefinedOrNull(bookingItemVM.bookingId);
        }).map((bookingItemVM: BookingCartItemVM) => {
            return bookingItemVM.transientBookingItem;
        }).value();
    }
}