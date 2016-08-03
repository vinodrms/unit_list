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
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {EmailSelectorComponent} from '../../../../../home-pages/hotel-operations/email-sender/components/email-selector/EmailSelectorComponent';

@Component({
    selector: 'new-booking-email-config',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-email-config/template/new-booking-email-config.html',
    directives: [LazyLoadingTableComponent, CustomScroll, EmailSelectorComponent],
    providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService],
    pipes: [TranslationPipe]
})
export class NewBookingEmailConfigComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('bookingCartReadOnly') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

    private _didAppearSubscription: Subscription;
    private _didDisappearSubscription: Subscription;

    customerList: CustomerDO[];

    constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService,
        private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService,
        private _wizardEmailConfigStepService: BookingEmailConfigStepService) {
        super();
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
        this._appContext.analytics.logPageView("/operations/new-booking/email-config");
    }
    public ngOnDestroy() {
        if (this._didAppearSubscription) { this._didAppearSubscription.unsubscribe(); }
    }

    private viewDidAppear() {
        this.customerList = this.buildCustomerList();
    }
    private buildCustomerList(): CustomerDO[] {
        var bookingCartItemList = this._bookingCartService.bookingItemVMList;
        var customerList: CustomerDO[] = [];
        _.forEach(bookingCartItemList, (bookingCartItem: BookingCartItemVM) => {
            customerList = customerList.concat(bookingCartItem.customerList);
        });
        return customerList;
    }

    public viewDidDisappear() {
    }

    public get emailRecipientList(): string[] {
        return this._wizardEmailConfigStepService.emailRecipientList;
    }
    public set emailRecipientList(emailRecipientList: string[]) {
        this._wizardEmailConfigStepService.emailRecipientList = emailRecipientList;
    }
}