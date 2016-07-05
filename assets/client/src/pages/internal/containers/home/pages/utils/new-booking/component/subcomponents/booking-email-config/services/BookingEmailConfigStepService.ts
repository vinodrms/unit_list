import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {AppContext, ThError, ThServerApi} from '../../../../../../../../../../../common/utils/AppContext';
import {IBookingStepService} from '../../utils/IBookingStepService';
import {ILastBookingStepService} from '../../utils/ILastBookingStepService';
import {BookingStepType} from '../../utils/BookingStepType';
import {BookingCartService} from '../../../../services/search/BookingCartService';
import {TransientBookingItem} from '../../../../services/data-objects/TransientBookingItem';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';
import {AddBookingItemsDO} from '../../../../services/data-objects/AddBookingItemsDO';
import {EmailRecipientVM} from '../utils/EmailRecipientVM';

@Injectable()
export class BookingEmailConfigStepService implements IBookingStepService, ILastBookingStepService {
    emailRecipientList: EmailRecipientVM[] = [];
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

    public addBookings(): Observable<boolean> {
        var transientBookingItemList: TransientBookingItem[] = _.map(this._bookingCartService.bookingItemVMList, (bookingItemVM: BookingCartItemVM) => {
            return bookingItemVM.transientBookingItem;
        });
        var bookingItems = new AddBookingItemsDO();
        bookingItems.bookingList = transientBookingItemList;
        bookingItems.confirmationEmailList = this.getRecipientEmailList();

        return this._appContext.thHttp.post(ThServerApi.BookingsAdd, { bookingItems: bookingItems })
            .map((resultObject: Object) => {
                return true;
            });
    }

    private getRecipientEmailList(): string[] {
        var recipientList: EmailRecipientVM[] = _.filter(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            return emailRecipient.isValid && emailRecipient.selected;
        });
        return _.map(recipientList, (recipient: EmailRecipientVM) => { return recipient.email });
    }
}