import {Component, ViewChild, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {BookingCartItemVM} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';
import {BookingEmailConfigStepService} from './services/BookingEmailConfigStepService';
import {EmailRecipientBuilder} from './utils/EmailRecipientBuilder';
import {EmailRecipientVM} from './utils/EmailRecipientVM';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {IBookingCustomerRegisterSelector} from '../utils/IBookingCustomerRegister';
import {BookingControllerService} from '../utils/BookingControllerService';

@Component({
    selector: 'new-booking-email-config',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-email-config/template/new-booking-email-config.html',
    directives: [LazyLoadingTableComponent, CustomScroll],
    providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService],
    pipes: [TranslationPipe]
})
export class NewBookingEmailConfigComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('bookingCartReadOnly') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

    private _customerRegisterSelector: IBookingCustomerRegisterSelector;

    private _didAppearSubscription: Subscription;
    private _didDisappearSubscription: Subscription;

    emailRecipientList: EmailRecipientVM[] = [];
    private _selectAll: boolean;
    private _cachedSelectedRecipientIdList: string[] = [];

    constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService,
        private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService,
        private _wizardEmailConfigStepService: BookingEmailConfigStepService, private _bookingControllerService: BookingControllerService) {
        super();
        this._customerRegisterSelector = _bookingControllerService;
    }

    ngAfterViewInit() {
        this._bookingCartTableComponent.bootstrap(this._bookingCartService, this._cartTableMetaBuilder.buildReadOnlyBookingCartTableMeta());
        this._bookingCartTableComponent.attachCustomCellClassGenerator(this._bookingTableUtilsService.customCellClassGeneratorForBookingCart);
        this._bookingCartTableComponent.attachCustomRowClassGenerator(this._bookingTableUtilsService.customRowClassGeneratorForBookingCart);
        this._bookingCartTableComponent.attachCustomRowCommandPerformPolicy(this._bookingTableUtilsService.canPerformCommandOnItemForBookingCart);
    }
    public ngOnInit() {
        this._didAppearSubscription = this._wizardEmailConfigStepService.didAppearObservable.subscribe((didAppear: boolean) => {
            this.viewDidAppear();
        });
        this._didDisappearSubscription = this._wizardEmailConfigStepService.didDisappearObservable.subscribe((didDisappear: boolean) => {
            this.viewDidDisappear();
        });
    }
    public ngOnDestroy() {
        if (this._didAppearSubscription) { this._didAppearSubscription.unsubscribe(); }
    }

    private viewDidAppear() {
        var customerList = this.getCustomerList();
        var emailRecipientBuilder = new EmailRecipientBuilder(customerList);
        this.emailRecipientList = emailRecipientBuilder.getEmailRecipientList(this._cachedSelectedRecipientIdList);
        this._selectAll = false;
    }
    public viewDidDisappear() {
        this._cachedSelectedRecipientIdList = _.map(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => { return emailRecipient.recipientId; });
    }

    private getCustomerList(): CustomerDO[] {
        var bookingCartItemList = this._bookingCartService.bookingItemVMList;
        var customerList: CustomerDO[] = [];
        _.forEach(bookingCartItemList, (bookingCartItem: BookingCartItemVM) => {
            customerList = customerList.concat(bookingCartItem.customerList);
        });
        return customerList;
    }

    public get selectAll(): boolean {
        return this._selectAll;
    }
    public set selectAll(selectAll: boolean) {
        this._selectAll = selectAll;
        if (selectAll) {
            this.selectAllValidEmailRecipients();
        }
    }
    private selectAllValidEmailRecipients() {
        _.forEach(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            if (emailRecipient.isValid) {
                emailRecipient.selected = true;
            }
        });
    }
    public addCustomer() {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this.addCustomerToRecipientsIfNotExists(selectedCustomer);
        });
    }
    private addCustomerToRecipientsIfNotExists(customer: CustomerDO) {
        var foundRecipient: EmailRecipientVM = _.find(this.emailRecipientList, (emailRecipient: EmailRecipientVM) => {
            return emailRecipient.recipientId === customer.id;
        });
        if (!this._appContext.thUtils.isUndefinedOrNull(foundRecipient)) {
            foundRecipient.recipientName = customer.customerName;
            foundRecipient.email = customer.emailString;
            foundRecipient.selected = foundRecipient.isValid;
            return;
        }
        var recipient = new EmailRecipientVM(customer.id, customer.customerName, customer.emailString);
        recipient.selected = recipient.isValid;
        this.emailRecipientList.push(recipient);
    }
}