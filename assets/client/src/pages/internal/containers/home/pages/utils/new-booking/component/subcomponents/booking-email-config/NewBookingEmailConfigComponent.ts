import {Component, ViewChild, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {BookingCartItemVM} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';
import {BookingEmailConfigStepService} from './services/BookingEmailConfigStepService';
import { CustomerDO } from '../../../../../../../../services/customers/data-objects/CustomerDO';
import { EmailDistributionDO } from "../../../services/data-objects/AddBookingItemsDO";

import * as _ from "underscore";

@Component({
    selector: 'new-booking-email-config',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-email-config/template/new-booking-email-config.html',
    providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService]
})
export class NewBookingEmailConfigComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('bookingCartReadOnly') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

    private _didAppearSubscription: Subscription;
    private _didDisappearSubscription: Subscription;

    customerList: CustomerDO[];
    bookingConfirmationsBlocked: boolean;

    constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService,
        private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService,
        private _wizardEmailConfigStepService: BookingEmailConfigStepService) {
        super();

        this.bookingConfirmationsBlocked = false;
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
        var allCustomers: CustomerDO[] = [];
        _.forEach(bookingCartItemList, (bookingCartItem: BookingCartItemVM) => {
            allCustomers = allCustomers.concat(bookingCartItem.customerList);
        });
        var customersAbleToReceiveConfirmations = _.filter(allCustomers, (customer: CustomerDO) => {
            return customer.customerDetails.canReceiveBookingConfirmations();
        });

        if(!_.isEmpty(allCustomers) && allCustomers.length > customersAbleToReceiveConfirmations.length) {
            this.bookingConfirmationsBlocked = true;
        }

        return customersAbleToReceiveConfirmations;
    }

    public viewDidDisappear() {
    }

    public get emailRecipientList(): string[] {
        return _.map(this._wizardEmailConfigStepService.emailRecipientList, (emailDistribution: EmailDistributionDO) => {
            return emailDistribution.email;
        });
    }
    public set emailRecipientList(emailRecipientList: string[]) {
        var emailDistributionList: EmailDistributionDO[] = [];
        emailDistributionList =_.map(emailRecipientList, (emailRecipient: string) => {
            var customerWithThatEmail: CustomerDO = _.find(this.customerList, (customer: CustomerDO) => {
                return customer.emailString === emailRecipient;
            });
            return {email: emailRecipient, recipientName: customerWithThatEmail ? customerWithThatEmail.customerName : ""};
        });
        this._wizardEmailConfigStepService.emailRecipientList = emailDistributionList;
    }
}